const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Recipe = require('../models/recipe');
const cloudinary = require('cloudinary');
const fs = require('fs');


// Config variables
const user_id = process.env.PORT ? process.env.USER_ID : fs.readFileSync(`${__dirname}/../private/user_id.txt`).toString();
const cloudinarySecret = process.env.PORT ? process.env.CLOUDINARY_SECRET : fs.readFileSync(`${__dirname}/../private/cloudinary_secret.txt`).toString();
cloudinary.config({ 
  cloud_name: 'dormh2fvt', 
  api_key: '778489856867779', 
  api_secret: cloudinarySecret 
});
const cloudinaryOptions = { quality: 60, gravity: 'center', height: 570, width: 570, crop: 'fill', tags: ['recipe_saver'] };


module.exports = function(app) {

  // Fetch all recipes
  app.get('/api/recipes/all', (req, res) => {

    Recipe.find({user_id}, 'title creationDate image', (err, recipes) => {
      if (err) console.error(err);
      res.send(recipes);
    })
    .collation({ locale: 'en' })
    .sort(sortObj(req.query.sort));

  });


  // Fetch favorites recipes
  app.get('/api/recipes/favorites', (req, res) => {
    Recipe.find({user_id, favorite: true}, 'title creationDate image', (err, recipes) => {
      if (err) console.error(err);
      res.send(recipes);
    })
    .collation({ locale: 'en' })
    .sort(sortObj(req.query.sort));
  });


  // Fetch untagged recipes
  app.get('/api/recipes/untagged', (req, res) => {
    Recipe.find({user_id, tags: {$size: 0}}, 'title creationDate image', (err, recipes) => {
      if (err) console.error(err);
      res.send(recipes);
    })
    .collation({ locale: 'en' })
    .sort(sortObj(req.query.sort));
  });


  // Fetch tag
  app.get('/api/recipes/tag/:tagName', (req, res) => {
    const { tagName } = req.params;

    Recipe.find({user_id, tags: { '$elemMatch': { 'name': tagName }}}, 'title creationDate image', (err, recipes) => {
        if (err) console.error(err);
        res.send(recipes);
    })
    .collation({ locale: 'en' })
    .sort(sortObj(req.query.sort));
  });


  // Change tag color
  app.post('/api/tag-color', (req, res) => {
    const { tagToUpdate, newColor } = req.body;

    Recipe.find({user_id, 'tags.name': tagToUpdate}, (err, recipes) => {

      saveRecipes(recipes);
    
      async function saveRecipes(recipes) {
        for (const recipe of recipes) {
          const targetTag = recipe.tags.find(tag => tag.name === tagToUpdate);
          targetTag.color = newColor;
          recipe.markModified('tags');
          await saveRecord(recipe);
        }

        res.json(recipes);
      }

      function saveRecord(doc) {
        return new Promise((resolve, reject) => {
          doc.save((err, saved) => {
            if (err) reject(err);
            resolve(saved);
          });
        });
      }
    });
  });


  // Fetch tags
  app.get('/api/tags', (req, res) => {

    const { search } = req.query;

    Recipe.find({user_id}, (err, recipes) => {
      if (err) console.error(err);

      let tags = [];
      const tagTracker = [];

      recipes.forEach(recipe => {
        if (!recipe.tags.length) return;
        recipe.tags.forEach(tag => {
          
          // If the tag was not already in the tag tracker add it to our tags
          const index = tagTracker.indexOf(tag.name);
          if (index === -1) {
            tag.count = 1;
            tags.push(tag);
            tagTracker.push(tag.name);
          } else {
            tags[index].count++;
          }
        });
      });

      if (search && search !== 'null') { // Note that null will be a string
        tags = tags.filter(tag => {
          return tag.name.indexOf(search) > -1;
        });
      }

      res.send(tags);
    });
  });


  // Get single recipe
  app.get('/api/recipe/:recipeID', (req, res) => {
    const { recipeID } = req.params;

    Recipe.findOne({ user_id, _id: recipeID}, (err, recipe) => {
      if (err) console.error(err);
      res.send(recipe);
    });
  });


  // Search for recipes/tags 
  app.get('/api/search/:term', (req, res) => {

    const { term } = req.params;

    Recipe.find({ user_id }, 'id title tags', { sort: { title: 1 }}, (err, recipes) => {
      if (err) console.error(err);

      const recipeResults = [];
      const tagResults = [];

      recipes.forEach(recipe => {
        // Capture recipe results
        if (recipe.title.toLowerCase().indexOf(term.toLowerCase()) > -1) {
          recipeResults.push(recipe);
        }

        // Capture tag reults
        recipe.tags.forEach(tag => {
          if (tag.name.toLowerCase().indexOf(term.toLowerCase()) > -1) {
            const isCaptured = tagResults.some(tagResult => tagResult.name.toLowerCase() === tag.name.toLowerCase());
            if (!isCaptured) tagResults.push(tag);
          }
        });
      });

      // Sort results by name first
      recipeResults.sort((a, b) => sortFn(a, b, 'title'));
      tagResults.sort((a, b) => sortFn(a, b, 'name'));

      function sortFn(a, b, criteria) {
        if (a[criteria].toLowerCase() < b[criteria].toLowerCase()) return -1; 
        if (a[criteria].toLowerCase() > b[criteria].toLowerCase()) return 1; 
        return 0;
      }

      // Move exact matches to the top of the list
      recipeResults.forEach((item, index) => prioritizeExactMatch(item, index, 'title', recipeResults));
      tagResults.forEach((item, index) => prioritizeExactMatch(item, index, 'name', tagResults));

      function prioritizeExactMatch(item, index, criteria, arr) {
        if (term.toLowerCase() === item[criteria].toLowerCase()) {
          arr.unshift(arr.splice(index, 1)[0]);
        }
      }

      res.json({ recipeResults, tagResults });
    });
  });


  // Update recipe
  app.post('/api/recipe/:recipeID', upload.fields([{ name: 'image-asset' }]),(req, res) => {
    const { recipeID } = req.params;
    const { title, url, description, tags, favorite, image } = req.body;

    const imageAsset = req.files['image-asset'] && req.files['image-asset'][0].path;

    if (recipeID === 'new') {
      const newRecipe = new Recipe();
      newRecipe.user_id = user_id;
      addRecipe(newRecipe);
    } else {
      Recipe.findOne({ user_id, _id: recipeID}, (err, recipe) => {
        if (err) console.error(err);
        addRecipe(recipe);
      });
    }

    function addRecipe(recipe) {
      recipe.favorite = favorite;
      recipe.title = title;
      recipe.url = url;
      recipe.description = description;
      recipe.tags = JSON.parse(tags);


      cloudinary.uploader.upload(imageAsset || image, result => {
        if (imageAsset) fs.unlink(imageAsset, err => {});
        recipe.image = result.url;
        saveRecipe(recipe);
      },
      cloudinaryOptions);

      function saveRecipe(recipe) {
        recipe.save((err, recipe) => {
          if (err) console.error(err);
          res.json(recipe);
        });
      }
    }
  });


  // Delete recipe
  app.delete('/api/recipe/:recipeID', (req, res) => {
    const { recipeID } = req.params;

    Recipe.findOne({ user_id, _id: recipeID}, (err, recipe) => {
      if (err) console.error(err);
      if (!recipe) return res.sendStatus(404);

      recipe.remove((err, data) => {
        if (err) console.error(err);
        res.json(data);
      });
    });
  });


  // Helper functions
  function sortObj(sort) {
    switch(sort) {
      case 'oldest':
        return { creationDate: 1 };
      case 'newest':
        return { creationDate: -1 };
      case 'a - z':
        return { title: 1 };
      case 'z - a':
        return { title: -1 };
      default:
        return { creationDate: -1 };
    }
  }

}
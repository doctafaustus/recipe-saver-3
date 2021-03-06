const User = require('../models/user');
const Recipe = require('../models/recipe');
const loggedIn = require('../middleware/logged-in');

module.exports = function(app, stripe) {

  // Test CC #: 4242424242424242
  app.post('/api/charge', (req, res) => {
    console.log('/charge');

    if (!req.session.passport) {
      return res.json({
        message: 'not logged in'
      });
    }
    
    User.findOne({ _id: req.session.passport.user._id }, (err, user) => {

      if (!user) return res.json({
        message: 'no user found'
      });

      console.log('Subscription', user.subscription);
      if (/Full/.test(user.subscription)) {
        return res.json({
          message: 'has full plan'
        });
      }

      // Create subscription
      stripe.customers.create({
        description: `RS Customer: ${req.session.passport.user._id}`,
        source: req.body.stripeToken,
        email: req.body.stripeEmail,
        metadata: { 
          rs_id: req.session.passport.user._id,
          rs_email: req.session.passport.user.email
        }
      }, 
      (err, customer) => {
        if (err) console.log(err);
        console.log('S customer', customer);

        stripe.subscriptions.create(
          {
            customer: customer.id,
            plan: (process.env.PORT) ? 'price_1Hbr3wD9ukuHTF1fMg5xF1Fz' : 'price_1HbpboD9ukuHTF1fNLGufj71', 
          }, 
          (err, subscription) => {
            console.log('subscription created!~', subscription);
            User.findOne({ _id: req.session.passport.user._id }, (err, user) => {
              if (err) throw err;
              user.subscription = 'Full (20/yearly)';
              user.stripeSubId = subscription.id;
              user.subActive = true;

              user.save((err) => {
                if (err) throw err;
                console.log(`Subscription created for ${req.session.passport.user._id}`);
                res.json({
                  message: 'new subscription'
                });
              });
            });
        });
      });
    });

  });

  app.get('/api/cancel-subscription', (req, res) => {
    console.log('/cancel-subscription');

    if (!req.session.passport) {
      return res.json({
        message: 'not logged in'
      });
    }

    User.findOne({ _id: req.session.passport.user._id }, (err, user) => {
      if (!user) return res.json({
        message: 'no user found'
      });

      const stripeSubId = user.stripeSubId;
      if (!stripeSubId) return res.json({
        message: 'no sub id'
      });

      // Cancel subscription
      stripe.subscriptions.del(
        user.stripeSubId,
        (err, confirmation) => {

          console.log('confirmation', confirmation);

          const currentPeriodEnd = Number(`${confirmation.current_period_end}000`);
          const endDate = new Date(currentPeriodEnd).toLocaleDateString().replace(/\/20(\d\d)$/, '/$1');

          user.subActive = false;
          user.subEnds = currentPeriodEnd;

          user.subscription = `Basic (Subscription ended ${endDate})`;
          user.save(err => {
            if (err) throw err;
            console.log(`Subscription cancelled for ${user._id}`);
            return res.json({
              message: 'successful cancellation'
            });
          });
        }
      );
    });

  });

  app.get('/api/delete-account', (req, res) => {
    console.log('delete-account');
    
    if (!req.session.passport) {
      return res.json({
        message: 'not logged in'
      });
    }

  
    Recipe.deleteMany({ user_id: req.session.passport.user._id }, (err, recipe) => {
      if (err) throw err;
      console.log(`All recipes deleted for ${req.session.passport.user._id}`);

      User.findOne({ _id: req.session.passport.user._id }, (err, user) => {

        // If user has a paid subscription then cancel it first
        if (user.subscription === 'Full (20/yearly)') {
          stripe.subscriptions.del(user.stripeSubId, (err, confirmation) => {
            console.log(`Subscription cancelled for ${req.session.passport.user._id}`, confirmation);
            deleteUser();

          });
        } else deleteUser();

        function deleteUser() {
          User.deleteOne({ _id: req.session.passport.user._id }, (err, user) => {
            if (err) throw err;
            console.log(`${req.session.passport.user._id} deleted`);
            req.session.destroy(() => {
              return res.json({
                message: 'account deleted'
              });
            });
          });
        }
      });

    });
  });

}
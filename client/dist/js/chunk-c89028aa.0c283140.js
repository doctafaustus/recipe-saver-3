(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c89028aa"],{3797:function(e,t,a){},"4c16":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"account"}},[a("SideNav"),a("Header"),a("div",{attrs:{id:"account-container"}},[a("div",{staticClass:"account-left"},[a("div",{class:{saving:e.imageIsSaving,"profile-image-container":!0}},[a("img",{attrs:{id:"profile-image",src:e.getUserImg()}}),a("input",{ref:"profileImageInput",attrs:{type:"file",id:"profile-image-input",accept:"image/*",hidden:""}}),a("div",{attrs:{id:"profile-image-overlay"},on:{click:e.triggerUpload}},[a("button",{staticClass:"new-profile-image-btn"},[e._v("Update Image")])])])]),a("div",{staticClass:"account-right"},[a("div",{staticClass:"account-name"},[e._v(e._s(e.user.name))]),a("ul",{staticClass:"account-info"},[a("li",[a("label",[e._v("Account Type")]),a("div",{staticClass:"account-info-value"},[e._v(e._s(e.user.subscription))])]),a("li",[a("label",[e._v("You Login Via")]),a("div",{staticClass:"account-info-value"},[e._v(e._s(e.loginMethod))])]),a("li",[a("label",[e._v("Member Since")]),a("div",{staticClass:"account-info-value"},[e._v(e._s(e.formatDate(e.user.creationDate)))])])])]),a("div",{staticClass:"upgrade-downgrade-account"},["Full (9/monthly)"===e.user.subscription?a("a",{attrs:{href:"#"},on:{click:function(t){return t.preventDefault(),e.cancelSubscription()}}},[e._v("Cancel Subscription")]):e._e(),/Basic/.test(e.user.subscription)?a("router-link",{attrs:{href:"#",to:{path:"/plans"}}},[e._v("Upgrade To Full Plan")]):e._e()],1),a("div",{staticClass:"delete-account"},[a("a",{attrs:{href:"#"},on:{click:function(t){return t.preventDefault(),e.confirmDeleteAccount()}}},[e._v("Delete Account")])])]),a("div",{directives:[{name:"show",rawName:"v-show",value:e.showModal,expression:"showModal"}],staticClass:"account-modal"},[a("div",{staticClass:"account-modal-inner",class:{error:e.error,processing:!0===e.processing,"account-modal-inner":!0,"confirm-delete":e.isConfirmDelete}},[e._m(0),a("div",{staticClass:"account-processing"},[e._v("Processing...")]),a("div",{staticClass:"account-modal-title"},[e._v(e._s(e.title))]),a("div",{staticClass:"account-message"},[e._v(e._s(e.message))]),a("div",{directives:[{name:"show",rawName:"v-show",value:!e.processing,expression:"!processing"}],staticClass:"account-modal-ctas"},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.isConfirmDelete,expression:"isConfirmDelete"}],staticClass:"account-delete-confirm-btn account-modal-cta",on:{click:function(t){return e.deleteAccountFinal()}}},[e._v("Delete Account")]),a("div",{staticClass:"account-modal-cta account-modal-close",on:{click:function(t){e.showModal=!1}}},[e._v("Close")])])]),a("div",{staticClass:"account-overlay"})])],1)},s=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"rs-logo"},[n("img",{staticClass:"rs-logo-image",attrs:{src:a("af3a")}})])}],i=(a("a481"),a("96cf"),a("3b8d")),r=(a("ac6a"),a("ffc1"),a("0418")),o=a("d3e3"),c=a("b012"),u=a("7b73"),l=a("d47f"),d=a("c5a6"),g=a("414a"),p=a("99b8"),m={components:{Header:r["a"],Icon:d["a"],SideNav:p["a"]},mixins:[g["a"]],data:function(){return{user:{},imageIsSaving:!1,showModal:!1,processing:!1,isConfirmDelete:!1,error:!1,title:"",message:""}},computed:{loginMethod:function(){var e;if(0===Object.entries(this.user).length)return"";e=this.user.googleId?"Google":this.user.facebookId?"Facebook":"Email";var t=" (".concat(this.user.email,")");return"".concat(e).concat("Email"===e?t:"")}},methods:{triggerUpload:function(){this.$refs.profileImageInput.click()},getUserImg:function(){return this.user.profileImage||"https://res.cloudinary.com/dormh2fvt/image/upload/v1559367596/logo-255x255_r72o7i.png"},getAccountData:function(){var e=Object(i["a"])(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,c["a"].getAccountData();case 2:t=e.sent,console.log("response",t.data),this.user=t.data;case 5:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),handleImage:function(){var e=Object(i["a"])(regeneratorRuntime.mark(function e(t){var a,n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(console.log(t.target),console.log(t.target.files),this.imageIsSaving=!0,a=t.target.files[0],!(a.size>3e6)){e.next=8;break}return this.imageIsSaving=!1,o["a"].$emit("MESSAGE",{title:"Error Uploading Photo",message:"Image must be 3MB or less",isError:!0}),e.abrupt("return");case 8:return e.next=10,u["a"].uploadImage(a);case 10:n=e.sent,console.log(n),document.querySelector("#profile-image").setAttribute("src",n.data.profileImage),this.imageIsSaving=!1,this.$ga.event({eventCategory:"User Actions",eventAction:"profile picture uploaded",eventLabel:n.data.profileImage.replace("https://res.cloudinary.com/dormh2fvt/image/upload/","")});case 15:case"end":return e.stop()}},e,this)}));function t(t){return e.apply(this,arguments)}return t}(),cancelSubscription:function(){var e=Object(i["a"])(regeneratorRuntime.mark(function e(){var t,a;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return console.log("cancelSubscription"),this.resetModal(),this.processing=!0,this.showModal=!0,e.next=6,l["a"].cancelSubscription();case 6:t=e.sent,a=t.data.message,this.processing=!1,"not logged in"!==a&&"no user found"!==a||(this.error=!0,this.title="Error",this.message="Could not find account. Please login again to retry. If the issues persists please contact support at support@recipesaver.me"),"no sub id"===a&&(this.error=!0,this.title="Error",this.message="Could not find subscription. Please contact support at support@recipesaver.me"),"successful cancellation"===a&&(this.title="Subscription Cancelled",this.message="You may continue using Recipe Saver Lite version and may upgrade again the future.",this.getAccountData()),console.log("cancel sub res",t);case 13:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),confirmDeleteAccount:function(){this.resetModal(),this.isConfirmDelete=!0,this.showModal=!0,this.title="WARNING! Are You Sure?",this.message=" Your entire account along with all your recipes will be permanently deleted. If you're a Full plan member your subscription will be canceled as well. Do you still wish to proceed?"},deleteAccountFinal:function(){var e=Object(i["a"])(regeneratorRuntime.mark(function e(){var t,a;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.resetModal(),this.processing=!0,e.next=4,l["a"].deleteAccount();case 4:t=e.sent,a=t.data.message,this.processing=!1,"not logged in"===a&&(this.error=!0,this.title="Something Went Wrong",this.message="Please try logging in again first."),"account deleted"===a&&(this.error=!0,this.title="Account Deleted",this.message="Your account (and subscription if you had one) has been deleted."),this.showModal=!0;case 10:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),resetModal:function(){this.error=!1,this.isConfirmDelete=!1,this.title="",this.message=""}},mounted:function(){document.querySelector("#profile-image-input").addEventListener("change",this.handleImage)},created:function(){this.getAccountData()},beforeCreate:function(){document.body.className="account"}},f=m,h=(a("b286"),a("2877")),v=Object(h["a"])(f,n,s,!1,null,null,null);t["default"]=v.exports},"504c":function(e,t,a){var n=a("0d58"),s=a("6821"),i=a("52a7").f;e.exports=function(e){return function(t){var a,r=s(t),o=n(r),c=o.length,u=0,l=[];while(c>u)i.call(r,a=o[u++])&&l.push(e?[a,r[a]]:r[a]);return l}}},af3a:function(e,t,a){e.exports=a.p+"img/logo-255x255.5a777ef2.svg"},b286:function(e,t,a){"use strict";var n=a("3797"),s=a.n(n);s.a},d47f:function(e,t,a){"use strict";var n=a("3f4a");t["a"]={charge:function(e){return Object(n["a"])().post("/charge",e)},cancelSubscription:function(){return Object(n["a"])().get("/cancel-subscription")},deleteAccount:function(){return Object(n["a"])().get("/delete-account")}}},ffc1:function(e,t,a){var n=a("5ca1"),s=a("504c")(!0);n(n.S,"Object",{entries:function(e){return s(e)}})}}]);
//# sourceMappingURL=chunk-c89028aa.0c283140.js.map
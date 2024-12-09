const Handlebars = require('handlebars');

Handlebars.registerHelper("formatDate", function (dateString) {
  if (!dateString) return "";
    return new Date(dateString).toString().split(" GMT")[0];
});

Handlebars.registerHelper("formatBirthday", function (dateString) {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0];
});
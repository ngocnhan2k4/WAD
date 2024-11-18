const Handlebars = require('handlebars');

Handlebars.registerHelper('shouldShowPage', function(index, currentPage, totalPages) {
    const page = index + 1;
    return page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2);
});

Handlebars.registerHelper('shouldShowEllipsis', function(index, currentPage, totalPages) {
    const page = index + 1;
    return (page === currentPage - 3 || page === currentPage + 3) && totalPages > 4;
});

Handlebars.registerHelper('contains', function(array, value) {
    if (Array.isArray(array)) {
        return array.includes(value);
    }
    return false;
});
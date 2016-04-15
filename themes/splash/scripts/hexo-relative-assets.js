hexo.extend.filter.register('before_post_render', function(data) {
	console.log('before replace');
    data.content = data.content.replace(/(!\[.*?\]\()(.+?)(\))/g, '');
	console.log('replace done');
    return data;
});

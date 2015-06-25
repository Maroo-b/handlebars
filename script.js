$(function(){
	var SearchResult = {
		init: function(config){
			this.url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyATFYDazNwVjPlZQKwj99jCC-QsmI9bJPU&cx=007444594658152580977%3Ad2ft4k6hmv0&q=rails';
			this.template = config.template;
			this.container = config.container;
			this.fetch();		
		},

		attachTemplate : function(){
			
			 var template = Handlebars.compile(this.template);
			 this.container.append(template(this.results));
		},
		fetch: function(){
			var self= this;
			$.getJSON(this.url, function(data){
				self.results = $.map(data.items, function(result){
					return {
						title : result.title,
						snippet : result.snippet,
						link : result.link

					};
				});
				self.attachTemplate();
			});
			
		}
	};

	SearchResult.init({
		template : $('#entry-template').html(),
		container : $('ul.search')
	});
	
});
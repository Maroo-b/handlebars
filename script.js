(function($){
	var o = $( {} );

	//Api for observer pattern
	$.each({
		trigger : 'publish',
		on : 'subscribe',
		off : 'unsubcribe'
	},function(key,val){
		jQuery[val] = function(){
			o[key].apply(o,arguments);
		}
	});
})(jQuery);



(function($){

	


	var SearchResult = {
		init: function(config){
			this.url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyATFYDazNwVjPlZQKwj99jCC-QsmI9bJPU&cx=007444594658152580977%3Ad2ft4k6hmv0&q=';
			this.template = config.template;
			this.container = config.container;
			this.searchInput = config.searchInput;
			this.timer;
			this.results = [];
			this.query = 'rails';
			this.bindEvent();
			
			this.subscription();
			$.publish( 'CustomSearch/query' );
			this.searchInput.val( this.query );
			return this;
				
		},

		bindEvent : function(){
			this.searchInput.on('keyup',this.search);
		},
		subscription : function(){
			$.subscribe('CustomSearch/query', this.fetch);
			$.subscribe('CustomSearch/data', this.attachTemplate);
			
		},
		search : function(){
			var self = SearchResult,
				input = this;

			clearTimeout(self.timer);
			self.timer = (input.value.length >= 3 )	&& setTimeout(function(){
				self.query = input.value;
				$.publish('CustomSearch/query');
			}, 400);	
		},
		attachTemplate : function(res){
			 var self = SearchResult;
			 var template = Handlebars.compile(self.template);
			 self.container.html(template(self.results));
		},
		fetch: function(){
			console.log('fetch');
			var self = SearchResult;
			console.log(self.url+self.query);
			 $.getJSON(self.url+self.query , function(data){
				self.results = $.map(data.items, function(result){
					return {
						title : result.title,
						snippet : result.snippet,
						link : result.link

					};
				});		
			console.log(self.results);
			$.publish('CustomSearch/data',self.results);
			});
			
		}
	};

	window.SearchResult = SearchResult.init({
		template : $('#entry-template').html(),
		container : $('ul.search'),
		searchInput : $('input[name = q]')
	});
	
})(jQuery);
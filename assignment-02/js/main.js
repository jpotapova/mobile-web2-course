(function ( ) {

	var accordeon = {
		
		/* initialise accordeon */
		init: function(){
			this.h2s = document.getElementsByTagName("h2");
			this.interactions();
		},
		
		/* hide article */
		hide: function(article){
			article.className = '';
		},
		
		/* show article, hide other articles at the same time */
		show: function(article){
			for(var counter=0; counter < this.h2s.length; counter++) {
				this.hide(this.h2s[counter].parentNode);
			}
			article.className = 'active';
		},
		
		/* decide whether to hide or show - is already open -> then hide */
		toggle: function (event) {	
			if ((event.target.parentNode.className).indexOf('active') === -1) {
				this.show(event.target.parentNode);
			} else {
				this.hide(event.target.parentNode);
			}	
		},
		
		/* listen to user interactions: click, touch */
		interactions: function(){
			var _self = this;
			for(var counter=0; counter < this.h2s.length; counter++) 
			{
				/*
				this.h2s[counter].addEventListener('touchend', function(event){
					this.toggle(event);
				}, false);
				*/
				
				
				this.h2s[counter].addEventListener('click', function(event){
					_self.toggle(event);
				}, false);
	
			}
		}
	
	};
	
	accordeon.init();
	
})( );


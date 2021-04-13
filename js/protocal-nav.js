protoCal.prototype.navigation = function(){ 
    var obj = this;

    var buttonVoid = function(){return []}
    
    var buttonBuilder = function(id, label, eventNavigation, eventClick){
        var button = Builder.node('a', {href: 'javascript: void(0);', id: id},[
    		            Builder.node('span', {className: 'left'}),
    		            Builder.node('span', {className: 'center'}, label),
    		            Builder.node('span', {className: 'right'}),
    	            ]);      
    	
        button.observe('click', function(){
            if(eventClick) eventClick();
            eventNavigation();
        });
        
		button.observe('mousedown', function(event){
            button.addClassName('pressed');
		}); 
		
		button.observe('mouseup', function(event){
            button.removeClassName('pressed');
		});
		
        return button;
    }
    
    var navigationButtons = function(){
        var buttonPrev      = buttonBuilder('buttonPrev', '<', obj.navigationOptions.buttonPrevClick, obj.options.buttonPrevClick);
        var buttonNext      = buttonBuilder('buttonNext', '>', obj.navigationOptions.buttonNextClick, obj.options.buttonNextClick);
        var buttonToday     = buttonBuilder('buttonToday', 'Today', obj.navigationOptions.buttonTodayClick, null);
        var buttonWeekView  = buttonBuilder('buttonWeekView', 'Week', obj.navigationOptions.buttonWeekViewClick, null);
        var buttonMonthView = buttonBuilder('buttonMonthView', 'Month', obj.navigationOptions.buttonMonthViewClick, null);
        
        switch(obj.options.type){
            case 'month':
                buttonMonthView.addClassName('pressed');
            break;
            
            case 'week':
                buttonWeekView.addClassName('pressed');            
            break;
        }
        
        var buttons = Builder.node('div', {className: 'calendar-navigation', id: 'navigation-bar'},[
            Builder.node('div', {className: 'button'},[
                obj.options.buttonPrev ? buttonPrev : []
            ]),
            Builder.node('div', {className: 'button'},[
                obj.options.buttonToday ? buttonToday : []
            ]),			
            Builder.node('div', {className: 'button'},[
                obj.options.buttonWeekView ? buttonWeekView : []
            ]),				
            Builder.node('div', {className: 'button'},[
                obj.options.buttonMonthView ? buttonMonthView : []
            ]),
            Builder.node('div', {className: 'button'},[
                obj.options.buttonNext ? buttonNext : []
            ]),
        ]);   
        return buttons;
    }
	
	return navigationButtons();
}

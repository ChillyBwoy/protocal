var protoCal = function(arguments){
    this.options = Object.extend({
        type: 'month',
        container: 'calendar',
        
        markOtherDaysTime: true,
                
        minDate: {},
        maxDate: {},
        
        markers: {},
        templates: {},
        
    	buttonPrev: true,           
    	buttonToday: true,
    	buttonWeekView: true,
    	buttonMonthView: true,
    	buttonNext: true,
    	
    	buttonPrevClick: function(){},
    	buttonNextClick: function(){},
		
		monthClassDay:      'month-day',
        monthClassToday:    'month-today',
        monthClassOtherday: 'month-other',
        
        weekClassHour:      'week-hour',
        weekClassNow:       'week-now',
        weekClassOthertime: 'week-other',
        
        monthEventDayClick: function(item){},
        monthEventDayOver: function(item){},
        monthEventDayOut: function(item){},            
        
        monthEventTodayClick: function(item){},
        monthEventTodayOver: function(item){},
        monthEventTodayOut: function(item){},
        
        monthEventOtherdayClick: function(item){},
        monthEventOtherdayOver: function(item){},
        monthEventOtherdayOut: function(item){},
        
        weekEventHourClick: function(item){},
        weekEventHourOver: function(item){},
        weekEventHourOut: function(item){},            
        
        weekEventNowClick: function(item){},
        weekEventNowOver: function(item){},
        weekEventNowOut: function(item){},
        
        weekEventOthertimeClick: function(item){},
        weekEventOthertimeOver: function(item){},
        weekEventOthertimeOut: function(item){},        
 	
    }, arguments);
    
	var obj = this;    
    
    this.navigationOptions = {
    	buttonPrev: this.options.buttonPrev,
    	buttonToday: this.options.buttonToday,
    	buttonWeekView: this.options.buttonWeekView,
    	buttonMonthView: this.options.buttonMonthView,
    	buttonNext: this.options.buttonNext,

        buttonPrevClick: function(){
            switch(obj.options.type){
                case 'month':
                    var prevMonth = _date.month - 1;
                    var prevYear  = _date.year;
    
                    if(prevMonth < 1){
                        prevMonth = 12;
                        prevYear--;
                    }
            
                    obj.setDate({
                        day:   _date.day,
                        month: prevMonth,
                        year:  prevYear
                    });
                    obj.month();
                break;
                
                case 'week':
                    var prevDay   = _date.day - 7;
                    var prevMonth = _date.month;
                    var prevYear  = _date.year;

                    if(prevDay < 0){
                        prevMonth--;
                        
                        if(prevMonth < 1){
                            prevMonth = 12;
                            prevYear--;
                        }
                        prevDay = obj.monthsInYear()[prevMonth - 1].days;
                    }
        
                    obj.setDate({
                        day:   prevDay,
                        month: prevMonth,
                        year:  prevYear
                    });
                    
                    obj.week();
                
                break;
            }
        },
        
        buttonNextClick: function(){
            switch(obj.options.type){
                case 'month':
                    var nextMonth = _date.month + 1;
                    var nextYear  = _date.year;

                    if(nextMonth > 12){
                        nextMonth = 1;
                        nextYear++;
                    }

                    obj.setDate({
                        day:   _date.day,
                        month: nextMonth,
                        year:  nextYear
                    });
                    
                    obj.month();                    
                break;
                
                case 'week':
                    var nextDay   = _date.day + 7;
                    var nextMonth = _date.month;
                    var nextYear  = _date.year;

                    if(nextDay > obj.monthsInYear()[_date.month - 1].days){
                        nextMonth++;
                        if(nextMonth > 12){
                            nextMonth = 1;
                            nextYear++;
                        }         
                        nextDay = 1;
                    }
    
                    obj.setDate({
                        day:   nextDay,
                        month: nextMonth,
                        year:  nextYear
                    });
                
                    obj.week();
                break;
            }
        },
        
        buttonTodayClick: function(){
            
            obj.setDate(obj.getNow());            
            
            switch(obj.options.type){
                case 'month':
                    obj.month();
                break;
                
                case 'week':
                    obj.week();                   
                break;
            }            
            

        },
        
        buttonWeekViewClick: function(){
            obj.options.type = 'week';
            obj.week();
        },
        
        buttonMonthViewClick: function(){
            obj.options.type = 'month';
            obj.month();
        }
    }
    
	var _currentDate = new Date();
	
    var _now        = new Object;
        _now.minute = _currentDate.getMinutes();
        _now.hour   = _currentDate.getHours();        
        _now.day    = _currentDate.getDate();
        _now.month  = _currentDate.getMonth() + 1;
        _now.year   = _currentDate.getFullYear();
    
    var _date        = new Object;
        _date.day    = _currentDate.getDate();
        _date.month  = _currentDate.getMonth() + 1;
        _date.year   = _currentDate.getFullYear();
        _date.hour   = _currentDate.getHours();
        _date.minute = _currentDate.getMinutes();
        
    this.daysOfWeek = [
            {fullName: 'Sunday',    shortName: 'Sun', num: 1, weekend: true},
            {fullName: 'Monday',    shortName: 'Mon', num: 2, weekend: false},
            {fullName: 'Tuesday',   shortName: 'Tue', num: 3, weekend: false},
            {fullName: 'Wednesday', shortName: 'Wed', num: 4, weekend: false},
            {fullName: 'Thursday',  shortName: 'Thu', num: 5, weekend: false},
            {fullName: 'Friday',    shortName: 'Fri', num: 6, weekend: false},
            {fullName: 'Saturday',  shortName: 'Sat', num: 7, weekend: true}
        ]
    
	this.getDayByDate = function(date){
		var day = parseInt(date.day);
		var mon = parseInt(date.month);
		var a = parseInt((14 - mon) / 12);
		var y = date.year - a;
		var m = mon + 12 * a - 2;
		var d = ( 7000 + parseInt(day + y + parseInt(y / 4) - parseInt(y / 100) + parseInt(y / 400) + (31 * m) / 12)) % 7;
		
		return this.daysOfWeek[d];
    }    

    this.monthsInYear = function(){
        return [
    		    {name: 'January'  , shortName: 'Jan', days: 31},
    		    {name: 'February' , shortName: 'Feb', days: checkLeapYear(_date) ? 29 : 28},
    		    {name: 'March'    , shortName: 'Mar', days: 31},
    		    {name: 'April'    , shortName: 'Apr', days: 30},
    		    {name: 'May'      , shortName: 'May', days: 31},
    		    {name: 'June'     , shortName: 'Jun', days: 30},
    		    {name: 'July'     , shortName: 'Jul', days: 31},
    		    {name: 'August'   , shortName: 'Aug', days: 31},
    		    {name: 'September', shortName: 'Sep', days: 30},
    		    {name: 'October'  , shortName: 'Oct', days: 31},
    		    {name: 'November' , shortName: 'Nov', days: 30},
    		    {name: 'December' , shortName: 'Dec', days: 31}
    		];
    }
    
	var checkLeapYear = function(date){
	    /*
	     *    Leap year:
	     *       1) mod 4 = 0
	     *       2) mod 100 != 0
	     *       3) mod 400 = 0
	     */
	    if(!(date.year % 4) && (date.year % 100) || !(date.year % 400))
			return true;
		else
			return false;
	}    
    
    this.getJSON = function(){
        var values = [];
        var month = this.monthsInYear()[_date.month - 1];
	    var firstDay = this.getDayByDate({day: 1, month: _date.month, year: _date.year});
	    var dayCount = 1;

	    for(var i = 0; i < firstDay.num - 1; i++){
			values.push(null);
	    }
	    
	    for(var i = firstDay.num - 1; i < 7; i++){
	        var d = this.getDayByDate({day: dayCount, month: _date.month, year: _date.year});
			values.push({
			        day:        dayCount,
			        dayNum:     d.num,
			        shortName:  d.shortName,
			        fullName:   d.fullName,
			        weekend:    d.weekend
			    });
            dayCount++;
	    }
	    
		var daysRemained = 0;
		
		for(var i = 0; i < 5; i++){
			for(var j = 0; j < 7; j++){
			    if(dayCount <= month.days){
        	        var d = this.getDayByDate({day: dayCount, month: _date.month, year: _date.year});
        			values.push({
        			        day:        dayCount,
        			        dayNum:     d.num,
        			        shortName:  d.shortName,
        			        fullName:   d.fullName,
        			        weekend:    d.weekend
        			    });
                    dayCount++;					
			    }else{
					daysRemained = 7 - j;
					break;
				}
			}
			for(var j = 0; j < daysRemained; j++){
				values.push(null);
			}
		}
		
        return {
            year:           _date.year,
            month:          _date.month,
            monthFullName:  month.name,
            monthShortName: month.shortName,
            days:           month.days,
            values:         values
        }
    }  
    
    this.checkIfOtherTime = function(date){
		var m = date.month;
		var d = date.day;
		var h = date.hour
		if(m < 10) m = '0' + m;
		if(d < 10) d = '0' + d;
		if(h < 10) h = '0' + h;		
		var sumDate  = date.year + '' + m + '' + d + '' + h;
		
		var m = _now.month;
		var d = _now.day;
		var h = _now.hour;
		if(m < 10) m = '0' + m;
		if(d < 10) d = '0' + d;
		if(h < 10) h = '0' + h;
		var sumToday = _now.year + '' + m + '' + d + '' + h;
		
		if(parseInt(sumDate) < parseInt(sumToday))
			return true;
		else
			return false;
    }    
    
    this.checkMinDate = function(date){
		var m = date.month;
		var d = date.day;
		if(m < 10) m = '0' + m;
		if(d < 10) d = '0' + d;
		var sumDate  = date.year + '' + m + '' + d;
		
		var m = this.options.minDate.month;
		var d = this.options.minDate.day;
		if(m < 10) m = '0' + m;
		if(d < 10) d = '0' + d;
		var sumMin = this.options.minDate.year + '' + m + '' + d;
		
		if(parseInt(sumDate) < parseInt(sumMin))
			return true;
		else
			return false;
    }
    
    this.checkMaxDate = function(date){
		var m = date.month;
		var d = date.day;
		if(m < 10) m = '0' + m;
		if(d < 10) d = '0' + d;
		var sumDate  = date.year + '' + m + '' + d;
		
		var m = this.options.maxDate.month;
		var d = this.options.maxDate.day;
		if(m < 10) m = '0' + m;
		if(d < 10) d = '0' + d;
		var sumMax = this.options.maxDate.year + '' + m + '' + d;
		
		if(parseInt(sumDate) > parseInt(sumMax))
			return true;
		else
			return false;
    }     
    
    this.checkIfOtherDay = function(date){
		var m = date.month;
		var d = date.day;
		if(m < 10) m = '0' + m;
		if(d < 10) d = '0' + d;
		var sumDate  = date.year + '' + m + '' + d;
		
		var m = _now.month;
		var d = _now.day;
		if(m < 10) m = '0' + m;
		if(d < 10) d = '0' + d;		
		var sumToday = _now.year + '' + m + '' + d;
		
		if(parseInt(sumDate) < parseInt(sumToday))
			return true;
		else
			return false;
    }  
	
	this.setDate = function(date){
        _date.day   = date.day;
        _date.month = date.month;
        _date.year  = date.year;
	}
	
	this.getDate = function(){
	    return _date;
	}	
	
	this.setNow = function(now){
        _now.minute = now.minute;
        _now.hour   = now.hour;
        _now.day    = now.day;
        _now.month  = now.month;
        _now.year   = now.year;
	}
	
	this.getNow = function(date){
        return _now;
	}			
    
    this.setMarkers = function(data){
        this.options.markers = data;
    }
    
    this.getMarkers = function(){
        return this.options.markers;
    }
    
    this.getMarkersValues = function(key){
        var markers = $H(this.options.markers);        
        
        var res = [];
        markers.each(function(m){
            if(m.key == key)
                res = m.value.values;
        });
        
        return res;
    }    
    
    this.setMarkersValues = function(key, data){
        var markers = $H(this.options.markers);
                
        markers.each(function(m){
            if(m.key == key){
                m.value.values = data;
            }
        });
    }
    
    this.getTemplates = function(){
        return this.options.templates;
    }
    
    this.setTemplates = function(data){
        this.options.templates = data;
    }
}

protoCal.prototype.dispatch = function(){
    
    switch(this.options.type){
        case 'month':
            this.month();
        break;
        
        case 'week':
            this.week();
        break;
    }
}

protoCal.prototype.week = function(){
    var obj = this; 
    var data  = this.getJSON();      
    
    var markers = $H(this.getMarkers());   
    var template = this.getTemplates().week;  
    
    var convert24To12 = function(hour){
        if(hour > 12) var h = hour - 12; else var h = hour;
		if(h < 10) h = '0' + h;
		if(hour >= 12) var ap = 'pm'; else var ap = 'am';
		return h + ':00 ' + ap;
    }
    
    var weekTimeline = function(){
        
        var ul = Builder.node('ul');
        ul.appendChild(
            Builder.node('li',[
                Builder.node('div', {className: 'timelabel'}, 'Time')
            ])
        );
        
        for(var i = 0; i < 24; i++){
            ul.appendChild(
                Builder.node('li',[
                    Builder.node('div', {className: 'time'}, convert24To12(i))
                ])                
            );
        }   
        return ul;
    }
    
    var weekDay = function(date, obj){

        if(date){
            var thisDay = obj.getDayByDate(date);
            
            var label = new Object;            
            label.name = thisDay.shortName + ', ' + date.day;
            label.className = thisDay.weekend ? 'daylabel-weekend' : 'daylabel';

            if((date.day == obj.getNow().day) && (date.month == obj.getNow().month) && (date.year == obj.getNow().year)){
                var ul = Builder.node('ul', {className: 'week-today'});
            }else{
                var ul = Builder.node('ul');                
            }
            ul.appendChild(Builder.node('li',[
                    Builder.node('div', {className: label.className}, label.name)
                ])
            );
        
            for(var i = 0; i < 24; i++){
                var cellProperties = new Object;
                cellProperties.id    = date.year + '-' + date.month + '-' + date.day + '-' + (thisDay.num - 1) + '-' + i;                          
                cellProperties.style     = '';
                cellProperties.value     = '';
                cellProperties.label     = '';
                cellProperties.hourClassName = 'val-' + (thisDay.num - 1) + '-' + i;
                
                if((date.day == obj.getNow().day) && (date.month == obj.getNow().month) && (date.year == obj.getNow().year) && (i == obj.getNow().hour)){                    
                    cellProperties.className = obj.options.weekClassNow;
                    cellProperties.click     = obj.options.weekEventNowClick;
                    cellProperties.over      = obj.options.weekEventNowOver;
                    cellProperties.out       = obj.options.weekEventNowOut;
                }else{
                    if(obj.checkIfOtherTime({year: date.year, month: date.month, day: date.day, hour: i}) && obj.options.markOtherDaysTime){
                        cellProperties.className = obj.options.weekClassOthertime;
                        cellProperties.click     = obj.options.weekEventOthertimeClick;
                        cellProperties.over      = obj.options.weekEventOthertimeOver;
                        cellProperties.out       = obj.options.weekEventOthertimeOut;
                    }else{  
                        if(obj.checkMinDate(date)){
                            cellProperties.className = obj.options.weekClassOthertime;
                            cellProperties.click     = obj.options.weekEventOthertimeClick;
                            cellProperties.over      = obj.options.weekEventOthertimeOver;
                            cellProperties.out       = obj.options.weekEventOthertimeOut;
                        }else{
                            if(obj.checkMaxDate(date)){
                                cellProperties.className = obj.options.weekClassOthertime;
                                cellProperties.click     = obj.options.weekEventOthertimeClick;
                                cellProperties.over      = obj.options.weekEventOthertimeOver;
                                cellProperties.out       = obj.options.weekEventOthertimeOut;                                
                            }else{
                                cellProperties.className = obj.options.weekClassHour;
                                cellProperties.click     = obj.options.weekEventHourClick;
                                cellProperties.over      = obj.options.weekEventHourOver;
                                cellProperties.out       = obj.options.weekEventHourOut;                                
                            }
                        }
                    }
                }         

                template.values.each(function(item){                    
                    if(
                            (cellProperties.hourClassName == ('val-' + (item.dayNum - 1) + '-' + item.hour)) &&
                            (!obj.checkIfOtherTime({year: date.year, month: date.month, day: date.day, hour: i}) && obj.options.markOtherDaysTime) &&
                            (!obj.checkMinDate(date)) && (!obj.checkMaxDate(date))
                            
                    ){
                        cellProperties.className = obj.options.weekClassHour;
                        cellProperties.click     = template.click ? template.click : function(){};
                        cellProperties.over      = template.over ? template.over : function(){};
                        cellProperties.out       = template.out ? template.out : function(){};
                        cellProperties.style     = 'background: ' + (template.background ? template.background : '');
                    }
                });
                                     
                markers.each(function(marker){
                    marker.value.values.each(function(item){
                        if((date.year == item.year) && (date.month == item.month) && (date.day == item.day) && ((i == item.hour) || (!item.hour) )){
                            cellProperties.className = obj.options.weekClassHour + ' ' + marker.key;
                            cellProperties.click = marker.value.weekClick ? marker.value.weekClick : function(){};
                            cellProperties.over  = marker.value.weekOver ? marker.value.weekOver : function(){};
                            cellProperties.out   = marker.value.weekOut ? marker.value.weekOut : function(){};
                            cellProperties.value = item.value ? item.value : '';
                            cellProperties.label = item.label ? item.label : '';
                            cellProperties.style = 'background: ' + (marker.value.background ? marker.value.background : '');
                            
                        }
                    });
                });
                
                var cell = Builder.node('div', {className: cellProperties.className, id: cellProperties.id, style: cellProperties.style}, [
                    cellProperties.label,
                    Builder.node('input', {type: 'hidden', value: cellProperties.value, className: cellProperties.hourClassName, name: cellProperties.hourClassName})                  
                ]);
                
                cell.getValue = function(){
                    return this.select('input')[0].value;
                };

                cell.setValue = function(value){
                    var input = this.select('input')[0].value;
                    input = value;                    
                };
                
                cell.observe('click', cellProperties.click);
                cell.observe('mouseover', cellProperties.over);
                cell.observe('mouseout', cellProperties.out);

                var li = Builder.node('li',[
                    cell
                ]);
                
                ul.appendChild(li);
            }
        }else{
            var ul = [];
        }
        return ul;        
    }
	
    var table = Builder.node('table', {className: 'week-grid'});
	var tbody = Builder.node('tbody');	
	
	table.appendChild(
	        Builder.node('caption', data.monthFullName + ' ' + data.year)
	    );
	
	var weeks = data.values.inGroupsOf(7);
    var tr = Builder.node('tr');
    
    var index = 0;
    var i = 0;
    weeks.each(function(week){
        week.each(function(day){
           if(day && (day.day == obj.getDate().day)){
               index = i;
           }
        });
        i++;
    });
    
    var currentWeek = weeks[index];
    var tr = Builder.node('tr');
    
    tr.appendChild(Builder.node('td', weekTimeline()));
    
    currentWeek.each(function(day){
	    
	    if(day){
    	    var sendDate = new Object;
    	    sendDate.day   = day.day;
    	    sendDate.month = data.month;
    	    sendDate.year  = data.year;
    	    sendDate.hour  = data.hour;
	    }
        tr.appendChild(
            Builder.node('td',[
                weekDay(sendDate, obj)
            ])
        )
    });
    
    tbody.appendChild(tr);
    
    table.appendChild(tbody);

    $(this.options.container).update('');    
    
    $(this.options.container).appendChild(Builder.node('div', {id: 'navigation'},[
        this.navigation()
    ]));
    $(this.options.container).appendChild(
            Builder.node('div', {className: 'week', id: 'calendar_week'},[table])
        );
}

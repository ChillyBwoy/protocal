protoCal.prototype.month = function(){
    var markers = $H(this.getMarkers());
    var templates = this.getTemplates().month;
        
    var monthCell = function(date, obj){
        var cell = null;
        if(date){
            var cellProperties = new Object;
            cellProperties.id = date.year + '-' +  date.month + '-' + date.day;
            cellProperties.style     = '';
            cellProperties.value     = '';
            cellProperties.label     = '';            
                        
            if( (obj.checkIfOtherDay(date))  && (obj.options.markOtherDaysTime) ){  
                cellProperties.className = obj.options.monthClassOtherday;
                cellProperties.click     = obj.options.monthEventOtherdayClick;
                cellProperties.over = obj.options.monthEventOtherdayOver;
                cellProperties.out  = obj.options.monthEventOtherdayOut;
            }else{
                
                if(obj.checkMinDate(date)){
                    cellProperties.className = obj.options.monthClassOtherday;
                    cellProperties.click     = obj.options.monthEventOtherdayClick;
                    cellProperties.over = obj.options.monthEventOtherdayOver;
                    cellProperties.out  = obj.options.monthEventOtherdayOut;
                }else{
                    if(obj.checkMaxDate(date)){
                        cellProperties.className = obj.options.monthClassOtherday;
                        cellProperties.click     = obj.options.monthEventOtherdayClick;
                        cellProperties.over = obj.options.monthEventOtherdayOver;
                        cellProperties.out  = obj.options.monthEventOtherdayOut;                        
                    }else{
                        if((date.day == obj.getNow().day) && (date.month == obj.getNow().month) && (date.year == obj.getNow().year)){  
                            cellProperties.className = obj.options.monthClassToday;
                            cellProperties.click     = obj.options.monthEventTodayClick;
                            cellProperties.oOver = obj.options.monthEventTodayOver;
                            cellProperties.out  = obj.options.monthEventTodayOut;
                        }else{
                            cellProperties.className = obj.options.monthClassDay;
                            cellProperties.click     = obj.options.monthEventDayClick;
                            cellProperties.over = obj.options.monthEventDayOver;
                            cellProperties.out  = obj.options.monthEventDayOut;
                        }                        
                    }
                }
            }          

            markers.each(function(marker){
                marker.value.values.each(function(item){
                     if((date.year == item.year) && (date.month == item.month) && (date.day == item.day)){
                        cellProperties.value     = item.value ? item.value : '';
                        cellProperties.label = item.label ? item.label : '';                        
                        cellProperties.className = obj.options.monthClassDay + ' ' + marker.key;               
                        cellProperties.style     = 'background: ' + (marker.value.background ? marker.value.background : '');
                        cellProperties.click     = marker.value.monthClick ? marker.value.monthClick : function(){};
                        cellProperties.over = marker.value.monthOver ? marker.value.monthOver : function(){};
                        cellProperties.out  = marker.value.monthOut ? marker.value.monthOut : function(){};
                    }
                });
            });

            cell = Builder.node('div', {className: cellProperties.className, id: cellProperties.id, style: cellProperties.style},[
                        date.day,
                        Builder.node('div', {align: 'center'}, cellProperties.label),
                        Builder.node('input', {type: 'hidden', value: cellProperties.value, className: 'val-' + cellProperties.id, name: 'val-' + cellProperties.id})
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
        }else{
           cell = Builder.node('div', {className: obj.properties.month.classNames.nil});           
       }           
       return cell;
    }    
        
    var data  = this.getJSON();
    var table = Builder.node('table', {className: 'month-grid'});
	var tbody = Builder.node('tbody');
	
	table.appendChild(
	        Builder.node('caption', data.monthFullName + ' ' + data.year)
	    );
	
	var weeks = data.values.inGroupsOf(7);
	
    var obj = this;
    
    var tr = Builder.node('tr');
    this.daysOfWeek.each(function(day){
        
        var className = day.weekend ? 'daylabel-weekend' : 'daylabel';
        tr.appendChild(
            Builder.node('th',[
                Builder.node('div', {className: className}, day.fullName)
            ])            
        )
    });
    
    tbody.appendChild(tr);
    
    weeks.each(function(week){
    	var tr = Builder.node('tr');
    	week.each(function(item){
    	    var sendDate = new Object;
    	    if(item){
        	    sendDate.day   = item.day;
        	    sendDate.month = data.month;
        	    sendDate.year  = data.year;
    	    }
    	    
            var td = Builder.node('td',[
                monthCell(sendDate, obj)
            ])
            tr.appendChild(td);    	    
    	})
    	tbody.appendChild(tr);
    })
    
    table.appendChild(tbody);

    $(this.options.container).update('');    
    
    $(this.options.container).appendChild(Builder.node('div', {id: 'navigation'},[
        this.navigation()
    ]));
    $(this.options.container).appendChild(
            Builder.node('div', {className: 'month', id: 'calendar_month'},[table])
        );
}

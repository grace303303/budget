//data Module
var dataModule = (function() {

	var Expense = function(id,description,value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	}

	Expense.prototype.calculatePer = function(totalIncome) {
		if (totalIncome!==0) {
              this.percentage = Math.round((this.value/totalIncome)*100);      
		}
	 else {
		this.percentage = -1;
	}
}

    Expense.prototype.getPer = function() {
    	return this.percentage;
    }

	var Income = function(id,description,value) {
		this.id = id;
		this.description = description;
		this.value = value
	}

	var data = {
		allItems:{
			exp: [],
			inc: []
		},
		totalData:{
			expenseTotal: 0,
			incomeTotal: 0
		},
		totalBudget: 0,
		percentage: -1
	}

	var calTotal = function(type) {
		var sum = 0;
		if (type==='exp') {
			if (data.allItems.exp.length===0) {
				data.totalData.expenseTotal = 0;
			} 
			else {
			data.allItems.exp.forEach(function(item) {
				sum = sum + item.value;
				data.totalData.expenseTotal = sum;
			} ) 
			}
		}
		else {
			if (data.allItems.inc.length===0) {
				data.totalData.incomeTotal = 0;
			} 
			else {
			data.allItems.inc.forEach(function(item) {
				sum = sum + item.value;
				data.totalData.incomeTotal = sum;
			} )
			}
		} 

	}

	return {
		addItem: function(type,des,val) {
			var ID, newItem;

			if (data.allItems[type].length===0) {
			    ID = 0;
			} 
			else {
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
			}

			if (type==='exp') {
				newItem = new Expense(ID,des,val)
			} else {
				newItem = new Income(ID,des,val)
			}
			data.allItems[type].push(newItem);
			return newItem;	
		},
		calBudget: function() {
		//Calculate Total
		calTotal('inc');
		calTotal('exp');
		// Calculate Budget
		data.totalBudget = data.totalData.incomeTotal - data.totalData.expenseTotal;
		//Calculate percentage
		if (data.totalData.incomeTotal>0) {
		data.percentage = Math.round(data.totalData.expenseTotal/data.totalData.incomeTotal*100);
		} 
		else {
		data.percentage = -1;
		}
		},
		getBudget: function() {
	    	return {
	    		budget: data.totalBudget,
	    		totalInc: data.totalData.incomeTotal,
	    		totalExp: data.totalData.expenseTotal,
	    		percentage:data.percentage
	    	}
	    },
		calPercentage: function() {
			data.allItems.exp.forEach(function(cur) {
			cur.calculatePer(data.totalData.incomeTotal);
			} )
		},
		getPercentage: function() {
			var perArr;
			perArr = data.allItems.exp.map(function(cur) {
			 return cur.getPer();
			} )
			return perArr;
		},
	   
	    deleteItem: function(type,id) {
	    	var idArr, index;

	    	idArr = data.allItems[type].map(function(current) {
	    		return current['id'];
	    	});

	    	index = idArr.indexOf(id);

	    	if (index!==-1) {
	    		data.allItems[type].splice(index,1);
	    	}
	    	
	    },

		testing: function() {
			console.log(data);
		}
	}


	
})();

//UI Module
var uiModule = (function() {

var DOMstrings = {
	inputType: '.add__type',
	inputDes: '.add__description',
	inputValue: '.add__value',
	btn:'.add__btn',
	incomeList:'.income__list',
	expenseList:'.expenses__list',
	budgetValue:'.budget__value',
	incomeValue: '.budget__income--value',
	expenseValue:'.budget__expenses--value',
	percentage: '.budget__expenses--percentage',
	container:'.container',
	expensePerc: '.item__percentage',
	dateLabel:'.budget__title--month',
	chooseLabel: '.add__type',

}; 

var formatNum = function(num,type) {
	var numSplit;
	num = Math.abs(num).toFixed(2);

	numSplit = num.split('.');
	int = numSplit[0];
	dec = numSplit[1];

	if (int.length>3) {
		int = int.substring(0,int.length-3) + ',' + int.substring(int.length-3,int.length);
	}

	return (type==='inc'?'+':'-') + int + '.' + dec;

};

var nodelistForEach = function(list,callback) {
    for (var i =0; i<list.length; i++) {
    callback(list[i],i);}};

return {
getInput: function() {
return {
type: document.querySelector(DOMstrings.inputType).value,
description: document.querySelector(DOMstrings.inputDes).value,
value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
}
  },
 getDOM: function() {
 	return DOMstrings;
 },
 addUIItem: function(inputType,item) {
//Create HTML placeholder
var html,newHtml,element;
if (inputType==='inc') {
element = DOMstrings.incomeList;
html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';} 
else {
html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
element = DOMstrings.expenseList;
}
//Replace HTML placeholder with inserted values
newHtml = html.replace('%id%',item.id);
newHtml = newHtml.replace('%description%',item.description);
newHtml = newHtml.replace('%value%',formatNum(item.value,inputType));
//Add HTML to the DOM using HTMLAdjacent insert
document.querySelector(element).insertAdjacentHTML('afterbegin',newHtml);
 },

 clearFileds: function() {
 	var fields,filedsArr;
 	fields = document.querySelectorAll(DOMstrings.inputDes + ',' + DOMstrings.inputValue);
 	filedsArr =  Array.prototype.slice.call(fields); //use slice trick to convert list to array
 	filedsArr.forEach(function(item){
 		item.value='';
 	});
 	fields[0].focus();
 },

 removeUIItem: function(idSelector) {
 	var el = document.getElementById(idSelector);
 	el.parentNode.removeChild(el);
 },
 displayBudget: function(obj) {
 	var type;
 	if (obj.budget>=0) {
 		type = "inc"; 
 	} else {
 		type = "exp";
 	}
 	document.querySelector(DOMstrings.budgetValue).innerText = formatNum(obj.budget,type);
 	document.querySelector(DOMstrings.incomeValue).innerText = formatNum(obj.totalInc,'inc');
 	document.querySelector(DOMstrings.expenseValue).innerText = formatNum(obj.totalExp,'exp');
 	if (obj.percentage>0) {
 	document.querySelector(DOMstrings.percentage).innerText = obj.percentage + '%';
 } else {
 	document.querySelector(DOMstrings.percentage).innerText = '---';
 }

 },
 displayPercentage: function(percentages) {
 	var fields;
    fields = document.querySelectorAll(DOMstrings.expensePerc);


    nodelistForEach(fields,function(current,index) {
     if (percentages[index]>0) {
    	current.innerText = percentages[index] + "%";
    } else {
    	current.innerText = '---';
    }
    });

 },
 updateDate: function() {
 	var now, months, month, year;
 	now = new Date();
 	months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
 	month = now.getMonth();
 	year = now.getFullYear();

 	document.querySelector(DOMstrings.dateLabel).innerText = months[month] + ' ' + year;

 },
 focusColor: function() {
 	var fields;
 	fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDes+',' + DOMstrings.inputValue);

 	nodelistForEach(fields,function(current) {
 		current.classList.toggle('red-focus');
 	});

 	document.querySelector(DOMstrings.btn).classList.toggle('red');

 }

   }

})();

//Update Budget Module
var updateBudget = function() {
	//1.Calculate budget
	dataModule.calBudget();
	//2.Return budget
	var budget = dataModule.getBudget();
	//3. Display budget on UI
	uiModule.displayBudget(budget);

	
};

//Update Percentage Module
var updatePercentage = function() {
	//1.Calculate percentage
	dataModule.calPercentage();
	//2.Return percentage from data controller
	var percentages=dataModule.getPercentage();
	//3. Display percentage on UI
	uiModule.displayPercentage(percentages);
	
};


//Controller Module
var controlModule = (function(dataMo,uiMo){
	var DOM = uiModule.getDOM();

	var setupEventlistener = function() {
		document.querySelector(DOM.btn).addEventListener('click',ctrlAddItem);
		document.addEventListener('keypress',function(a){
		if (a.keyCode===13 || a.which===13) {
			ctrlAddItem();
		}});
		document.querySelector(DOM.container).addEventListener('click',ctrlRemoveItem);
		document.querySelector(DOM.chooseLabel).addEventListener('change',uiModule.focusColor);

	}

	var ctrlAddItem = function() {
		var input,newItem;
		//1. get input values
		input = uiModule.getInput();
		if (input.description!=='' && !isNaN(input.value) && input.value>0) {
		//2. Add input into data
		newItem = dataModule.addItem(input.type,input.description,input.value);
		//3. Add input into UI 
		uiModule.addUIItem(input.type,newItem);
		//4. Clear input fields
		uiModule.clearFileds();
		//5.Cal and update budget
		updateBudget();
		//6.Cal and update percentage
		updatePercentage();

	} 
}

	var ctrlRemoveItem = function(event) {
		//1.Remove from data
		var IDarr,type,ID;

		item = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if (item) {
		IDarr = item.split('-');
		type = IDarr[0];
		ID = parseInt(IDarr[1]);
		dataModule.deleteItem(type,ID)

		//2.Remove from UI
		uiModule.removeUIItem(item);

		//3.Update and show new budget
		updateBudget();

		//4.Cal and update percentage
		updatePercentage();


		}
	}

	return {
		init: function() {
			console.log("App started.");
			uiModule.displayBudget({
				budget:0,
				totalInc:0,
				totalExp:0,
				percentage:-1

			});

			uiModule.updateDate();
			setupEventlistener();
		}
	}

})(dataModule,uiModule);

controlModule.init();


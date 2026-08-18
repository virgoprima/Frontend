//alert("Azazaza");
/*
console.log('привет');
var b=5;
var a=486;
var string='Здравствуйте';
var flag=false;
//var massive[1,2,3];
parseInt('12');
parseFloat('4,04');
Boolean(1);
var y=3.14;
2+3
34*3
console.log(string);

var c=a+b;


if (a%2==0) { console.log('число четное');
    
} else {
    console.log('число нечетное');
    

}
    console.log(a*b+a);
    
    var v=10;
    var u=2;
    var r=v-u;// скорость лодки в реке против течения
    var t=1;
    var tt=2;
    var s=r*tt;
    var ss=v*t;
    var z=s+ss;
    console.log (z);
   
    
aa=    Math.pow(f,2);
bb=    e*e;
console.log((aa+bb)/2);

Math.abs();

//домашнее задание 05.04.16//
// задача 1

var v1=3;/* скорость первого автомобиля*/
var v2=9;/* скорость второго автомобиля*/
var s=7; /* расстояние между автомобилями до начала удаления*/
var t=2; /*время движения*/
var s1=t*v1; /*расстояние, пройденное первым автомобилем*/
var s2=t*v2; /*расстояние, пройденное вторым автомобилем*/
var s3=s+s1+s2; /*финальное расстояние между автомобилями*/

console.log (s+s1+s2);


// задача 2

/*Найти длину окружности и площадь круга заданного радиуса R. В качестве значения Pi использовать 3.14.*/
// длина окружности = 2пR
// площадь круга = п(R*R)

var r=34;
var pi=3.14;
var l =2*pi*r;
console.log (l);


var rr=34;
var aa=Math.pow(rr,2);
var sss=aa*3.14;
console.log (sss);


// задача 3

/*Найти корни квадратного уравнения A·x2 + B·x + C = 0, заданного своими коэффициентами A, B, C 
(коэффициент A не равен 0),
 если известно, что дискриминант уравнения неотрицателен*/
 

 var a=2;
 var b=10;
 var c=4;
 
 var y=Math.pow(b,2);
 var d=y-4*a*c;
 if (d>=0){console.log('уравнение решается');
} else {
console.log('уравнение не имеет действительных корней');
}
var x1=(-b+Math.sqrt(d))/2*a;
var x2=(-b-Math.sqrt(d))/2*a;
 
console.log(x1,x2);

// задача 4

/*Проверить истинность высказывания: 
"Сумма двух первых цифр данного четырехзначного числа равна сумме двух его последних цифр"*/

var a=5;
var b=4;
var c=7;
var d=3;

if ((a+b)==(c+d)){console.log('Сумма двух первых цифр данного четырехзначного числа равна сумме двух его последних цифр');
} else {
console.log('Сумма двух первых цифр данного четырехзначного числа не равна сумме двух его последних цифр');
}

// задача 5

/*Даны координаты (как целые от 1 до 8) двух различных полей шахматной доски. 
Если король за один ход может перейти с одного поля на другое, вывести логическое значение True,
в противном случае вывести значение False. */

var x=1;
var y=1;
var x1=2;
var y1=2;

if ((Math.abs(x-x1)==1)&&(Math.abs(y-y1)==1)) {alert('True');}else {alert('False');}

alert();
x=prompt("Введите число\n");

document.write("x="+x);


x=prompt("How old are you?")
"25"


max=10
min=0
mynumber=Math.floor(Math.random()*
(max-min+1))+min;
var answer=prompt('Я загадал число от '+min+' до '+max+"\n Какое число я загадал?");
if(answer<mynumber){
    alert('Больше...');
} else if (answer>mynumber) {
    alert('Меньше');
} else {
    alert('Именно!');
}
console.log('Загадано число '+mynumber)



//тернарный оператор
//проверка авторизации (упрощенная)
console.log(loged=(typeof(login) !=='undefined')
? 'Auth ok': 'Need auth');
login=y;

var a=0;
while (a!=new Date().getFullYear()){
    a=prompt('Введите номер текущего года')
}
alert('верно');
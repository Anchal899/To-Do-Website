//make a variable named signupBtn and assign it the document elements(DOM ELEMENTS) having "signup" as their id
//const --> so that its value cannot be changed
const signupBtn= document.getElementById('signup');

//make a variable named loginBtn and assign it the document elements(DOM ELEMENTS) having "login" as their id
const loginBtn= document.getElementById('login');

//document.querySelector--> to select the first DOM-element that matches the specified CSS selector(class in HTML), if not found then returns null
// Example  
//var firstItem = document.querySelector('.item');
// console.log(firstItem.textContent); // Outputs: Item 1


// var allItems = document.querySelectorAll('.item');
// allItems.forEach(function(item) {
//     console.log(item.textContent);
// });
// // Outputs:
// // Item 1
// // Item 2
// // Item 3
const signupContainer=document.querySelector('.signup-container')
const loginContainer=document.querySelector('.login-container')


//addEventListener-->to define an anonymous function which will be executed when we will execute the mentioned event
// in this case the event is click
loginBtn.addEventListener('click',()=>{

    //This is typically used to apply a specific style or trigger a CSS animation(slide-up in this case) that corresponds to the 'slide-up' class.
    //signupContainer.classList will have all the elements that comes under the first signup class
    // .add('slide-up') --> to add the css features of slide-up to all the elements coming under first signup class(already stored in signupContainer)
    
    //sign up goes up(only 5% from top)
    signupContainer.classList.add('slide-up');

    //This is likely used to undo any styling or animation applied by the 'slide-up' class on the loginContainer.
    loginContainer.classList.remove('slide-up');
});
signupBtn.addEventListener('click',()=>{

    // login goes down (90% from top)
    loginContainer.classList.add('slide-up');


    signupContainer.classList.remove('slide-up');
});




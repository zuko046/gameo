const { response } = require("../../app")
const { subtotal } = require("../../helper/user-helpers")

function addToCart(productId) {
    $.ajax({
        url: '/users/addcart/' + productId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                let count = $('#cartCount').html()
                count = parseInt(count) + 1
                $("#cartCount").html(count)
            }
            swal("Product Added to Cart!", "You Can check it out and Buy!", "success");
        }
    })
}

function changeQuantity(cartId, productId, count) {
    let quantity = parseInt(document.getElementById(productId).innerHTML)
    count = parseInt(count)
    $.ajax({
        url: '/users/changeProductQuantity',
        data: {
            cart: cartId,
            product: productId,
            count: count,
            quantity: quantity
        },
        type: 'post',
        success: (response) => {
            if (response.removeProduct) {
                alert("product remove from cart")
                location.reload()
            } else if (response.stock){
                document.getElementById('addproductbtn').style.display = "none"
            }else{
                document.getElementById(productId).innerHTML = quantity + count
                document.getElementById('total').innerHTML = "$ "+response.total
                console.log(response.subtotal)
                document.getElementById(response.data.productname).innerHTML = "$ "+response.data.subtotal
            }
        }
    })
}


// function removeCartItem(productId) {
//     $.ajax({
//         url: '/users/removeCartItem',
//         type: 'post',
//         data: { productID: productId },
//         success: () => {
//             console.log('hai ahi ahai ahia ');

//         }

//     })
// }



function addToWishList(productId){
    $.ajax({
        url:'/users/addwishlist/'+productId,
        method:'get',
        success:(response)=>{
            if (response.status) {

            swal("Product Added to wishList!", "You Can check it out !", "success");
                document.getElementById('add' + proId).classList.add("d-none")
                document.getElementById('remove' + proId).classList.remove("d-none")
                
            } else {
            swal("Product Removed from wishList!","","error");
              
                document.getElementById('remove' + proId).classList.add("d-none")
                document.getElementById('add' + proId).classList.remove("d-none")
            }
        }
    })
}
function clearWishlist(productId){
    $.ajax({
        url:'/users/removeProductWIshList/'+productId,
        method:'get',
        success:(response)=>{
            location.reload()
        }
    })
}


function cancelOrders(orderid,proid){
    console.log("return order")
         swal({
        title: "Are you sure?",
        text: "Do you want to Cancel the Product !!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No!",
        closeOnConfirm: true,
        closeOnCancel: true,
            },
      function (isConfirm) {
        if (isConfirm) {
         $.ajax({
            url:'/users/history/order/cancelproduct',
            type:"post",
            success:(response)=>{

            }
        })
    
       }
     }
   )
}



//  pagination


// chart 




// category offer 

// function discountChange(categoryname, id) 
// { console.log(categoryname, id) 
// var discountvalue = document.getElementById(categoryname).value
// console.log(discountvalue);
//  $.ajax({ 
//   url: "/admin/categoryoffer", 
//   data: {
//         discountvalue, categoryname 
//         },
//   type: "post", 
//   success: (response.status) => {
// console.log(response);
//  if (response) { 
//   document.getElementById(id).innerHTML =response.discountvalue,
//   location.reload();
//                 } 
//      } 
//    })
// }


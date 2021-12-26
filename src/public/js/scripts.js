$('#post-comment').hide();

$('#btn-toggle-comment').click(function(e){
  e.preventDefault();
  $('#post-comment').slideToggle();
});

$('#btn-like').click(function(e){
  e.preventDefault();
  let imgId = $(this).data('id');
  console.log(imgId);
  
  fetch('/images/'+imgId+'/like' , {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({img: imgId })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      $('.likes-count').text(data.likes);
    });
 

})

 // Delete Button Request
  $('#btn-delete').click(function (e) {
    e.preventDefault();
    let $this = $(this);
    const response = confirm('Are you sure you want to delete this image?');
    if (response) {

      let imgId = $(this).data('id');

      fetch('/images/' + imgId, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "delete",
        body: JSON.stringify({img: imgId })
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          $this.removeClass('btn-danger').addClass('btn-success');
          $this.find('i').removeClass('fa-times').addClass('fa-check');
          $this.append('<span>Deleted!</span>');
          setTimeout(function () {
            window.location.replace('/');
          }, 1000); //will call the function after 2 secs.

        });

   }
 });

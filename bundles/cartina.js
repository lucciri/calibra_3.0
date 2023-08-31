$('.regione').on('click',function(){
  $('.regione').removeClass('selected');
  $(this).addClass('selected'); 
  console.log($(this).data('nome-regione')); 
});
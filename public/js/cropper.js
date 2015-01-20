
$("#cropResult").click(function(){
	var imgBase64 = $('#image-cropper').cropit('export', {
	  type: 'image/jpeg',
	  quality: .8,
	  originalSize: true
	});
	$("#cropResultImg").attr("src", imgBase64 )
})

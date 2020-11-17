function get_qs(key,index) { 
    var vars = [], hash,qs;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');     
    
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }    
    qs = vars[key] || false;
    if(index && vars.indexOf(key) > -1)
    {
        qs = vars[vars.indexOf(key)] ;
    } 
    return qs;
}

function get_hash(){ 
	var hash = false;
	if(window.location.hash) 
	{
		var hash = window.location.hash.substring(1).replace('#', ''); 	   
	} 
	return hash;
}

function hash_by_key(key) {
	var matches = location.hash.match(new RegExp(key+'=([^&]*)'));	
	return matches ? matches[1] : null;
}

function create_raw_cookie(name, value, t) {
    if (t) {
        var date = new Date();
        date.setTime(date.getTime() + t * 1000);
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function read_raw_cookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}

function download(dataurl) {
  var a = document.createElement("a");
  a.href = dataurl;
  a.setAttribute("download", dataurl.substring(dataurl.lastIndexOf('/')+1));
  a.click();
}

function get_positions(element,gap){ 	
	var winheight = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;	
	var position = [];		
	var gap = typeof gap == 'undefined' ? 0 : gap;		
	var position = [];
	var top_parent_position = element.getBoundingClientRect();	
	var elem_top_riched_viewport_bottom = top_parent_position.top-gap >= winheight ? false : winheight - top_parent_position.top; //a intrat in view		
	var elem_top_riched_viewport_top = top_parent_position.top-gap < 0 ? true : false; //a ajuns la header
	var elem_bottom_riched_viewport_bottom = (top_parent_position.top + top_parent_position.height) >= winheight ? false : true;
	var elem_bottom_riched_viewport_top = top_parent_position.bottom-gap > 0 ? top_parent_position.bottom-gap : true;
	position['elem_top_riched_viewport_bottom'] = elem_top_riched_viewport_bottom;
	position['elem_top_riched_viewport_top'] = elem_top_riched_viewport_top;
	position['elem_bottom_riched_viewport_bottom'] = elem_bottom_riched_viewport_bottom;
	position['elem_bottom_riched_viewport_top'] = elem_bottom_riched_viewport_top;
	return position;		 
}

$(function() {        
    AOS.init({
        disable: function() {
            var maxWidth = 800;
            return window.innerWidth < maxWidth;
        }
    });   
    $('select.styled').each(function(){
        var select = $(this); 
        var selcontainer = '';
        var def = select.attr('default');
        select.find('option').filter(function( index ) {
            if($(this).is('[selected="selected"]')){ def = $(this).text(); }            
            selcontainer += '<li data-selected="'+$(this).is('[selected="selected"]')+'" data-val="'+$(this).attr('value')+'">'+$(this).text()+'</li>';            
            return;
        });
        $('<div class="styled-dropdown"><div class="selected-option">'+def+'</div><ul>'+selcontainer+'</ul></div>').insertBefore(select);
    });
    $('.selected-option').on('click',function(e){
        e.preventDefault();
        var dropdown = $(this).parents('.styled-dropdown');
        dropdown.toggleClass('expanded-dropdown');   
        var def_label =  $(this).next('ul').find('[data-selected="true"]').text() || dropdown.next('.styled').attr('default');         
        var label = dropdown.is('.expanded-dropdown') ? dropdown.next('.styled').attr('default') : def_label;        
        $(this).text(label);       
    });
    
    $('.styled-dropdown li').on('click',function(e){
        e.preventDefault();
        var dropdown = $(this).parents('.styled-dropdown');
        var original = dropdown.next('.styled');        
        original.val($(this).attr('data-val')); 
        dropdown.find('li').removeAttr('data-selected');
        $(this).attr('data-selected','true');
        dropdown.find('.selected-option').text($(this).text());
        dropdown.toggleClass('expanded-dropdown');   
        original.change();        
    });
    
    $('.expand-button').on('click',function(e){
        e.preventDefault();
        $(this).prev('.expand').toggleClass('expanded');        
        $(this).text($(this).prev('.expand').hasClass('expanded') ? 'Show less' : 'Show more')
    });
    
    $('.filters-form h4').on('click',function(e){
        e.preventDefault();
        if($(this).is('.by-label'))
        {
            $(this).parents('.side').toggleClass('expanded-filters');        
            $(this).toggleClass('expanded-label'); 
        }
        else
        {
            $(this).next('.filters').toggleClass('expanded-filters');        
            $(this).toggleClass('expanded-label'); 
        }
    });
            
    $('.filters-form :checkbox').on('change',function(e){        
        var checked = $(this).parents('.filters').find(':checked').map(function () {
            return this.value;
        }).get();
        if($(this).is('.clearall'))
        {
            checked = '';
        }
        $(this).parents('.filters').find($('[data-filter]')).val(checked);        
        $('.filters-form').submit();       
    });
    
    $('.filters-form select').on('change',function(e){
        var checked = $(this).parents('.filters').find(':selected').map(function () {         
            return this.value;
        }).get();
        $(this).parents('.filters').find($('[data-filter]')).val(checked);
        $('.filters-form').submit();       
    });
    
    $('.filters-form').on('submit',function(e){        
        e.preventDefault();         
        $('.spin').show();
        $('[data-filter]').each(function(){
            var filter = $(this).attr('data-filter');
            if($.trim($(this).val()) != '')
            {
                $(this).attr('name',filter);             
            }
            else
            {
                $(this).removeAttr('name');  
            }
        });       
        create_raw_cookie('__BFA__Insights_CH', window.scrollY, 631138519);   
        $(window).on('scroll',function(){window.scroll(0, read_raw_cookie('__BFA__Insights_CH'));});
        $(this).off();  
        $(this).submit();        
    });
    
    if($('.filters-form').length && read_raw_cookie('__BFA__Insights_CH'))    
    {        
        window.scroll(0, read_raw_cookie('__BFA__Insights_CH'));
        create_raw_cookie('__BFA__Insights_CH','', 631138519);       
    }    
    
    $('.nav-trigger,.nav-menu .close').on('click',function(){        
		$('body').removeClass('search-active');
        if($('body').is('.menu-active'))
        {
            $('body').removeClass('menu-active').removeClass('nav-active');             
        }
        else
        {
             $('body').addClass('nav-active menu-active');
        }
       
	});
    
     $('.search-trigger').on('click',function(){		
        if($('body').is('.search-active'))
        {
            $('body').removeClass('search-active');
        }
        else
        {
            $('body').addClass('search-active');
        }
	});
    $('html,body').on('click',function(){
		$('body').removeClass('search-active');
	});
    $('.search,.search-trigger,header').on('click',function(e){
		e.stopPropagation();
	}); 
    
    $('.main-menu').on('click',function(){
		$('html,body').removeClass('menu-active');
	});
    
    $('.nav-menu').on('click',function(e){
		e.stopPropagation();
	}); 
    
    var win = $(window);
    var gap = window.matchMedia("(max-width: 1000px)").matches ? 40 : 80;
    if($(this).scrollTop()>gap){
        $('header').addClass('painted');
    }
    
    win.scroll(function(){ 
        var gap = window.matchMedia("(max-width: 1000px)").matches ? 40 : 80;
        if($(this).scrollTop()>gap){
            $('header').addClass('painted');
        }
        else
        {
             $('header').removeClass('painted');
        }
    });

    var back_to_top_button = $('<a href="#" class="back-to-top" title="Back to top"></a>');	
	var bottom_element = $('.back-to-top-holder-inside');
	bottom_element.append(back_to_top_button);
	var back_to_top = $('.back-to-top-holder').find('.back-to-top');
	bottom_element = bottom_element.get(0);	
    if($(window).scrollTop() > 50)
    {
        back_to_top.addClass('show-back');
	}

	var previousScroll = 0;
	$(document).on('load scroll resize', function() {
		var scroll_pos = document.documentElement.scrollTop || document.body.scrollTop;
		var bottom_element_position = get_positions(bottom_element,0);
		var currentScroll = $(this).scrollTop();
		if(scroll_pos > 50)
		{
			if(currentScroll > previousScroll)
			{
				back_to_top.removeClass('show-back');
				back_to_top.removeClass('fixed-back');
			}
			else
			{
				back_to_top.addClass('show-back');
				back_to_top.addClass('fixed-back');
				if(bottom_element_position['elem_top_riched_viewport_bottom'])
				{
					back_to_top.removeClass('fixed-back');
				}
				else
				{			
					back_to_top.addClass('fixed-back');
				}
			}
			previousScroll = currentScroll;
		}
		else
		{
			back_to_top.removeClass('show-back');			
		}
	});

    $('.back-to-top-holder').on('click','.back-to-top',function(e){	
		e.preventDefault();
		$('html, body').animate({ scrollTop: $("html, body").offset().top },300);
	});

    if(window.matchMedia( "(max-width: 780px)" ).matches)
    {
        $('body').find('.sponsors-boxes.boxes_3').removeClass('boxes_3');
        $('body').find('.sponsors-boxes.boxes_4').removeClass('boxes_4');
        $('body').find('.sponsors-boxes.boxes_5').removeClass('boxes_5');
       
        $('.sponsors-slider').each(function(index) {
            var _this = $(this);
            var slides = _this.attr('data-slides') == '0' ? '3' : _this.attr('data-slides');
            var columns =  _this.data('columns') || 0;
            var inline = _this.data('inline') || '';
            var next = 'next'+index;
            var prev = 'prev'+index;
            var watchit = true; 
            _this.find('.swiper-button-next').addClass(next);
            _this.find('.swiper-button-prev').addClass(prev);
            
            var nav = '';
            
            if(inline)
            {			
                nav = {
                    nextEl:'.'+next,
                    prevEl:'.'+prev,			
                }
                columns = 0;
                watchit = false;
            }
            
            var swiper = new Swiper(_this.find('.sponsors-slider'), {
                autoplay: {
                    delay: 5000,
                },
                slidesPerView: slides,
                spaceBetween: 10,			
                slidesPerGroup: slides,		
                watchOverflow:watchit,		 
                loopFillGroupWithBlank: true,
                pagination: {
                    el: '#nav-related',
                    clickable: true,	
                    dynamicBullets: true, 
                },	
                on: {
                    init: function () {
                        $(window).focus();
                        _this.find('.swiper-container').css({'opacity':'1','height':'100%'});
                    },
                },
                navigation: nav,		
                breakpoints: {
                    782: {	
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    spaceBetween: 10,
                    },
                    500: {	
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                        spaceBetween: 10,
                    },
                    480: {	
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 0,
                    },
                    300: {	
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 0,
                    }
                }
            });   
        }); 
    }

    $('.testimonial-slider').each(function(index) {
        var _this = $(this);
        var slides = _this.attr('data-slides') == '0' ? '1' : _this.attr('data-slides');
        var columns =  _this.data('columns') || 0;
        var inline = _this.data('inline') || '';
        var next = 'next'+index;
        var prev = 'prev'+index;
        var watchit = true; 
        _this.find('.swiper-button-next').addClass(next);
        _this.find('.swiper-button-prev').addClass(prev);
        
        var nav = '';
        
        if(inline)
        {			
            nav = {
                nextEl:'.'+next,
                prevEl:'.'+prev,			
            }
            columns = 0;
            watchit = false;
        }
        
        var swiper = new Swiper(_this.find('.testimonial-slider'), {
            autoplay: {
                delay: 5000,
            },
            slidesPerView: slides,
            spaceBetween: 10,			
            slidesPerGroup: slides,		
            watchOverflow:watchit,		 
            loopFillGroupWithBlank: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            on: {
                init: function () {
                    $(window).focus();
                    _this.find('.swiper-container').css({'opacity':'1','height':'100%'});
                },
            },
            navigation: nav
        }); 
        
        if(_this.find('.swiper-slide').length <= 1) { $(this).addClass('no-pagination'); }
    });

    $('body').on('click', '.popup-form-cta', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var contact_form_popup = $('body').find('div[data-popup-id="'+$(this).attr('id')+'"]');
        var gate = '';        
        if($(this).is('[gate]')){
            gate =  $(this).attr('gate'); 
            if(read_raw_cookie('__BFA_gated'))
            {                 
                 var gated = read_raw_cookie('__BFA_gated').split(',');
                 if(gated.indexOf(gate) > -1)
                 {
                    if(gate.replace(window.location.host,'').indexOf('.') !== -1 && gate.indexOf(window.location.host) !== -1) 
                    {
                        download(gate);
                        contact_form_popup.removeClass('active-contact-form-popup');
                    }
                    else
                    {
                        window.location = gate;  
                    }          
                    return false;
                 }
            }        
        }
        if(gate){                     
            contact_form_popup.find('.wpcf7').attr('gate',gate);
            contact_form_popup.find('.UID').val(generateUUID());
        }           
        contact_form_popup.addClass('active-contact-form-popup');
    });
    
    $('.contact-form-popup-container').on('click', '.close-contact-form-popup', function(){
        $(this).parents('.contact-form-popup-container').removeClass('active-contact-form-popup');
    });

    document.addEventListener( 'wpcf7invalid', function( event ) {
        var wpcf7_id = $(this)[0].activeElement.form.parentElement.id;
        var pos_wpcf7 = $('#' + wpcf7_id).find('.wpcf7-not-valid').eq(0).parent().position().top;
        if($('#' + wpcf7_id).parents('.contact-form-popup-container').length)
        {
            setTimeout( function() {
                $('#' + wpcf7_id).find('.wpcf7-form').animate({scrollTop: pos_wpcf7}, 500, 'swing');
            }, 100);
        }
        else
        {
            setTimeout( function() {

                $('html').stop().animate({
                    scrollTop: $('#' + wpcf7_id).find('.wpcf7-not-valid').eq(0).offset().top - 150,
                  }, 500, 'swing');

            }, 100);
        }
    }, false );

    document.addEventListener( 'wpcf7mailsent', function( event ) {
        var cf7_mail_id = $(this)[0].activeElement.form.parentElement.id;
        setTimeout( function() {
            $('html').animate({scrollTop: $('#' + cf7_mail_id).find('.wpcf7-response-output').offset().top - 150}, 500, 'swing');
        }, 100);    
    }, false );   
 
    $(document).on('wpcf7mailsent',function(event){
        var gated = $(event.target);   
       
        if(gated.find('.subscribe-form').length)
        {
            gated.addClass('sent-cf7-form');
            gated.prepend('<h2>Thank you</h2>');
        }
		console.log("ss"+gated.find('.download').val());
        if(gated.find('.download').length)
        {  
			console.log("mere");
			download(gated.find('.download').val());
		}
        if(gated.is('[gate]'))
        {             
            var gate =  gated.attr('gate');  
            var gated_vals = '';            
            if(read_raw_cookie('__BFA_gated'))
            {
                gated_vals = read_raw_cookie('__BFA_gated')+',';
            } 
            if(gated.find('.UID').length)
            {              
                var curr_uuids = read_raw_cookie('__BFA_gated_UUID');               
                var curr_uuid = '';  
                var gated_name = $('.UID').attr('name');
                var gated_val = $('.UID').val();
                if(curr_uuids)
                {                    
                    $.each(curr_uuids.split('|'),function(i,v){
                        if(v.indexOf(gated_name) > -1)
                        {
                            curr_uuid = 1;
                            return false;
                        }
                    });
                }                
                if(!curr_uuid.length)
                {
                    var gated_UUID = curr_uuids ? (curr_uuids+'|'+gated_name+'='+gated_val) : (gated_name+'='+gated_val);
                    create_raw_cookie('__BFA_gated_UUID',gated_UUID, 631138519);
                }                 
            }
            create_raw_cookie('__BFA_gated',gated_vals+gate, 631138519);
            if(gate.replace(window.location.host,'').indexOf('.') !== -1 && gate.indexOf(window.location.host) !== -1) 
            {
                download(gate);
                $('.active-contact-form-popup').removeClass('active-contact-form-popup');
            }
            else
            {
                window.location = gate;  
            }
        }      
    });
    
    $('app').each(function(e) {
        var app = $(this);
        var uuid = read_raw_cookie('__BFA_gated_UUID');
        var asrc = app.attr('src').replace('=','').split('?').pop();        
        var curr_uuids = read_raw_cookie('__BFA_gated_UUID');     
        var curr_uuid = '';  
        if(curr_uuids)
        {
            $.each(curr_uuids.split('|'),function(i,v){
                if(v.indexOf(asrc) > -1)
                {
                    curr_uuid = v.split('=').pop();
                    return false;
                }
            });
        }        
        app.append('<iframe src="'+app.attr('src')+curr_uuid+'" width="'+app.attr('width')+'" height="'+app.attr('height')+'"></iframe>');
    });   
        
    var cf7f = $('.wpcf7');
    if(cf7f.find('[name="gate"]').length)
    {
        cf7f.attr('gate',cf7f.find('[name="gate"]').val());
    }     
    cf7f.find('.UID').val(generateUUID());
    

    $('.companies-boxes').on('click', '.inside.popup', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.companies-popup-container').addClass('active-companies-popup');
        $('.companies-popup-container').find('.company-container').hide(0);
        $('.companies-popup-container').find('div[data-company-id="'+$(this).attr('id')+'"]').show(100);
    });
    
    $('.companies-popup-container').on('click', '.close-companies-popup', function(){
        $(this).parents('.companies-popup-container').removeClass('active-companies-popup');
    });

    $(document).on('click', function(e){

        if($('body').find('.companies-popup-container').is('.active-companies-popup') && !$(e.target).parents('.company-container').length)
        {            
            $('body').find('.active-companies-popup').removeClass('active-companies-popup');
        }

        if($('body').find('.contact-form-popup-container').is('.active-contact-form-popup') && !$(e.target).parents('.wpcf7-form').length)
        {            
            $('body').find('.active-contact-form-popup').removeClass('active-contact-form-popup');
        }

        if($('body').find('.vimeo-popup-container').is('.active-vimeo-popup') && !$(e.target).parents('.vimeo-container-iframe').length)
        {            
            $('body').find('.active-vimeo-popup').removeClass('active-vimeo-popup');
            $('body').find('.vimeo-popup-container .vimeo-container-iframe section').empty();
        }       
        
    });
    
    function omieresponse(omie)
    {
        if (omie.matches){ 
            $('.menu-item-has-children > a').on('click', function(e){
                e.preventDefault();
                var nm = $(this).next('.sub-menu');
                $(this).parent('li').toggleClass('active');
                if(!nm.find('.overview').length){
                    nm.prepend('<li class="overview"><a href="'+$(this).attr('href')+'">Overview</a></li>');
                }                
            });
        }       
    }
    var omie = window.matchMedia("(max-width: 1000px)");
    omieresponse(omie);
    omie.addListener(omieresponse);
    
    if($('body').is('.single-post'))
    {
        if($('body').find('.wide .single-content.w-700').length)
        {
            $('body').find('.wide .single-content.w-700 a').each(function(index, value){  
                if(value.href.indexOf('bfaglobal.com') === -1)
                {
                    value.target = '_blank';
                }
            });
        }
    }

    $('.company-tabs').on('click', 'label', function(){  
        var category_id = $(this).attr('label-category');
        window.location.hash = category_id;
        $('body').find('.companies-boxes section .inside').parent().hide();
        $(this).parent().find('.active-tab-label').removeClass('active-tab-label');
        $(this).addClass('active-tab-label');
        if(category_id === 'all')
        {
            $('body').find('.companies-boxes section .inside').parent().show();
        }
        else
        {
            $('body').find('.companies-boxes section .inside[data-category="'+category_id+'"]').parent().show();
        }
        var count = $('body').find('.companies-boxes section .inside:visible').length;
        $('#company-count').text(count);
    });

    var hash = window.location.hash;
	if(hash && window.location.href.indexOf(hash) > -1) {
		if($('body').find('.company-tabs').length)
		{
            hash = hash.replace('#', '');
            $('body').find('.active-tab-label').removeClass('active-tab-label');
			$('.company-tabs').find('label[label-category="'+hash+'"]').addClass('active-tab-label');
            $('.companies-boxes section .inside').parent().hide();
            if(hash === 'all')
            {
                $('body').find('.companies-boxes section .inside').parent().show();
            }
            else
            {
                $('body').find('.companies-boxes section .inside[data-category="'+hash+'"]').parent().show();
            }

            $('html').stop().animate({
                scrollTop: $('.company-tabs').offset().top - 150,
              }, 500, 'swing'); 
		}		
    }
    
    var project_slider = new Swiper('.project-slider .swiper-container', {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 50,
      pagination: {
        el: '.project-swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.proj-next',
        prevEl: '.proj-prev',
      }
    });

    $('.module.icon-boxes.vimeo-container').on('click','a[href*="player.vimeo"]', function(e){
        e.preventDefault();
        e.stopPropagation();

        var vimeo_id = $(this).attr('href');
        $(this).parents('body').find('.vimeo-popup-container').addClass('active-vimeo-popup');
        $(this).parents('body').find('.vimeo-popup-container .vimeo-container-iframe section').empty();
        $(this).parents('body').find('.vimeo-popup-container .vimeo-container-iframe section').append('<button type="button" class="close-vimeo-popup" title="Close Vimeo">Close <i class="bfa-icon-times"></i></button><iframe title="What Is Catalyst Fund" src="'+vimeo_id+'" allow="autoplay; fullscreen" allowfullscreen="" width="100%" height="400" frameborder="0"></iframe>');
    });    

    $('.vimeo-popup-container').on('click', '.close-vimeo-popup', function(){
        $(this).parents('.vimeo-popup-container').removeClass('active-vimeo-popup');
        $(this).parents('.vimeo-popup-container').find('.vimeo-container-iframe section').empty();
    });
});
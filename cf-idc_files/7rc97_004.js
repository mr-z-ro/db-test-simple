// source --> https://bfaglobal.com/wp-content/themes/bfaglobal2020/js/actions.js?ver=2.0.8 
$ = jQuery;
$(function() { 
   
   var offset = 0;
    $('.insights-content .load-more').on('click', function(e) {
        $('.spin').show();
        var wy = window.scrollY;
        $(window).on('scroll',function(){window.scroll(0,wy);});
        var offset = $('.insights-content .append-more section').length;
        var filters_form = $('.filters-form');
        var publication_type = $.trim($(filters_form).find('[data-filter="publication_type"]').val());
        var area_of_work = $.trim($(filters_form).find('[data-filter="area_of_work"]').val());
        var project = $.trim($(filters_form).find('[data-filter="project"]').val()) || $.trim($(filters_form).find('[data-filter-hidden="project"]').val());    
        var notin = $.trim($(filters_form).find('[data-filter-hidden="notin"]').val()); 
        var authored = $.trim($(filters_form).find('[data-filter="authored"]').val());
        var date = $.trim($(filters_form).find('[data-filter="date"]').val());
        
        var country = $.trim($(filters_form).find('[data-filter="country"]').val()); 
        var start = $.trim($(filters_form).find('[data-filter="start"]').val());       
        var end = $.trim($(filters_form).find('[data-filter="end"]').val());  
        
        var keyword = $.trim($(filters_form).find('[data-filter="keyword"]').val());       
        
        var innovation_type = $.trim($(filters_form).find('[data-filter="innovation_type"]').val());
        var data = { 
                'action': 'ins_listing',  
                'nonce' : ajax_obj.front_nonce,
                'offset' : offset, 
                'notin' : notin, 
                'publication_type': publication_type,
                'area_of_work': area_of_work,
                'publication_type': publication_type,
                'project': project,
                'authored': authored,
                'date': date,
                'keyword' : keyword,                          
        };
        if($('.insights-content').is('.programmes'))
        {
            data.programmes = 1;
            data.country = country;
            data.start = start;
            data.end = end;
        }
        
        if($('.insights-content').is('.innos'))
        {
            data.innos = 1;     
            data.innovation_type = innovation_type;
        }
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: ajax_obj.ajax_url,
            data: data,
            success: function(data){                 
                $('.append-more').append(data.res);
                $('.spin').hide();                 
                $(window).off('scroll');               
                if(data.count <= 9)
                {
                    $('.load-more').remove();                   
                }
                //console.log(data)
            }
        });
    });
    
});
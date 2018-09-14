$(document).ready(function() {

    init_links();

    var light;
    var light_on = false;
    var light_restart_delay = 1000;
    var light_path_duration = 100;
    var light_max_delay = 100;

    var slider_fade_duration = 1000;
    var slider_item_duration = 9000;
    var slider_current_id = 0;
    var $slider_items = $('.slider-inner div');
    var $slider_last_item;

    var middle_figure_path_duration = 300;
    var middle_figure_max_delay = 100;
    var middle_figure_max_delta = 5000;
    var middle_figure_flipped_start_offset_range = 3000;
    var middle_figure_vivus = [];

    window.onresize = update_background_position;

    rotate($("#circle1"), 50, 0, -0.1);
    rotate($("#circle2"), 50, 0.7, 0.06);
    rotate($(".more .colon:nth-child(1)"), 50, 0.7, 20);
    rotate($(".more .colon:nth-child(2)"), 50, 0.7, -30);

    update_background_position();
    light_callback();
    slider_step();

    middle_figure_start_animation("square");
    middle_figure_start_animation("square-flipped", true);

    function init_links() {
        for (var link_location in config["links"]) {
            var selector = "." + link_location + " a";
            var link = config["links"][link_location];
            if (!link["visible"]) {
                $(selector).remove();
                continue;
            }
            $(selector).attr("href", link["url"]);
            $(selector).html(link["text"]);
        }
    }
    
    function rotate($div, speed, degree, deltaDegree) {        
        $div.css({ WebkitTransform: 'rotate(' + degree + 'deg)'});  
        $div.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});                      
        timer = setTimeout(function() {
            degree+=deltaDegree;

            if(degree > 360)
                degree -= 360;
            else if(degree < -360)
                degree += 360;

            rotate($div, speed, degree, deltaDegree);
        }, speed);
    }

    function middle_figure_start_animation(id, delayed) {
        delay = randomize(middle_figure_max_delay);
        duration = delay + randomize(middle_figure_path_duration);
        
        middle_figure_vivus[id] = new Vivus(
            id, {
                type: 'delayed',
                delay: delay,
                duration: duration,
                start: 'manual'
            }
        );
        middle_figure_vivus[id].setFrameProgress(0);

        if (delayed) {
            setTimeout(function() {
                middle_figure_animation_step(id, 1);
            }, randomize(middle_figure_flipped_start_offset_range));
            return;
        }

        middle_figure_animation_step(id, 1);
    }

    function middle_figure_animation_step(id, direction) {
        timeout = randomize(middle_figure_max_delta);
        middle_figure_vivus[id].play(direction);
        setTimeout(function() {
            middle_figure_animation_step(id, direction * -1);
        }, timeout);
    }

    function randomize(value)
    {
        return Math.floor(Math.random() * value / 2 + value / 2);
    }

    function update_background_position() {
        $slider_item = $('.slider-inner div');
        var light_height = $('.slider').height();
        var body_height = $(window).height();
        var leftover_height = Math.floor((light_height - body_height) * 0.95 / 2);

        $slider_item.css({
            'top': leftover_height,
            'bottom': leftover_height
        });
    }

    function light_callback() {
        light_on = !light_on;
        delay = Math.floor(Math.random() * light_max_delay / 2 + light_max_delay / 2);
        duration = delay + Math.floor(Math.random() * light_path_duration / 2 + light_path_duration / 2);
        light = new Vivus(
            'light', 
            {
                type: 'delayed',
                delay: delay,
                duration: duration,
                start: 'manual'
            },
            light_callback
        );
        
        light.setFrameProgress(light_on);
    }

    function slider_step() {
        slider_current_id++;

        if (slider_current_id == 6)
            slider_current_id = 1;

        if ($slider_last_item != null) {
            $slider_last_item.removeClass("slider-item-active-opacity");
            setTimeout(slider_next, slider_fade_duration);
        } else {
            slider_next();
        }
    }

    function slider_next() {
        if ($slider_last_item != null) {
            $slider_last_item.removeClass("slider-item-active-transform");
            // $slider_last_item.css("visibility", "hidden");
        }

        $slider_last_item = $($slider_items[slider_current_id - 1]);

        $slider_last_item.css("opacity", "0");
        $slider_last_item.addClass("slider-item-active-opacity");
        $slider_last_item.addClass("slider-item-active-transform");

        setTimeout(slider_step, slider_item_duration);
    }
});

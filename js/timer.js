$(document).ready(function() {
    var diff = 5;
    var date_obj = new Date(Date.now() + diff*60000);
    var date_till = dateFormat(date_obj, "mmmm d yyyy HH:MM:ss") + " GMT+0300";
    console.log(date_till);

    var $digits;
    var $colon;
    var $hours, $minutes, $seconds;
    var vivus_hours = [], vivus_minutes = [], vivus_seconds = [];
    var vivus_objects = {};
    var new_timer_parsed = {
        'total': "",
        'hours': "00",
        'minutes': "00",
        'seconds': "00",
    };
    var last_timer_parsed = null;
    // var digit_animation_duration = 25;
    var digit_animation_duration = 20;
    var timer_downtime = 1000;
    var timer_finished_glitch_roll_delta = 200;
    var finished_animation_duration = 40;
    var seconds_before_redirect = 2;

    var digit_tokens = [];

    prepare();

    function prepare() {
        $digits = $('.digits').children();

        $('.digits svg').css({
            opacity: 0
        });

        $colon = $($digits[10]).html();

        $colons = $('.colon');
        $colons.html($colon);

        // $days = $('.days');
        $hours = $('.hours');
        $minutes = $('.minutes');
        $seconds = $('.seconds');

        // fill_container($days, 9, 0);
        // fill_container($days, 9, 1);
        fill_container($hours, 9, 0);
        fill_container($hours, 9, 1);
        fill_container($minutes, 5, 0);
        fill_container($minutes, 9, 1);
        fill_container($seconds, 5, 0);
        fill_container($seconds, 9, 1);

        $.each($colons, function(index, value) {
            var temp_colon_id = "colon" + index;
            var $svg_obj = $($(value).children()[0]);
            $svg_obj.attr("id", temp_colon_id);
            vivus_objects[temp_colon_id] = new Vivus(
                temp_colon_id, {
                    type: 'sync',
                    duration: digit_animation_duration,
                    start: 'manual'
                }
            );
            vivus_objects[temp_colon_id].setFrameProgress(0);
            $svg_obj.css("opacity", 1);
            vivus_objects[temp_colon_id].play(1);
        });

        // vivus_objects['click_animation'] = new Vivus(
        //     "click_animation", {
        //         type: 'sync',
        //         duration: finished_animation_duration,
        //         start: 'manual'
        //     }
        // );
        // vivus_objects['click_animation'].setFrameProgress(0);
        // $("#click_animation").css("display", "block");

        $('.timer').click(click_animation_logic);

        
        timer_init(date_till);
    }

    function click_animation_logic() {
        vivus_objects["click_animation"].play(1);
        $(".background-fader, .background-inner svg, .destiny-logo, .rotating-layer, .left a, .right a, .top a, .bottom a").each(function() {
            $(this).addClass("clean");
        });

        $(".slider, .timer").addClass("bright");

        redirect("https://eu.battle.net/shop/ru/product/game/destiny");
    }

    function redirect(url) {
        setTimeout(function() {
            window.location = url;
        }, seconds_before_redirect * 1000);
    }

    function get_vivus_id(type, position, number) {
        return type + position + number;
    }

    function fill_container($container, till, position) {
        var container_html = '';
        var $container_subset = $($container.children()[position]);
        for (i = 0; i <= till; i++) {
            var digit_obj = $digits[i];
            var $digit = $($(digit_obj).children()[0]);
            var type = $container.attr('class');
            var new_id = get_vivus_id(type, position, i);

            $digit.attr('id', new_id);

            digit_html = $(digit_obj).html();

            container_html += digit_html;
        }
        $container_subset.html(container_html);
        prepare_container($container, till, position);
    }

    function prepare_container($container, till, position) {
        for (i = 0; i <= till; i++) {
            var type = $container.attr('class');
            var new_id = get_vivus_id(type, position, i);
            var $digit = $("#" + new_id);
            prepare_vivus_for_element(new_id, $digit);
        }
    }

    function prepare_vivus_for_element(id, $digit) {
        vivus_objects[id] = new Vivus(
            id,
            {
                type: 'sync',
                duration: digit_animation_duration,
                start: 'manual'
            }
        );
        vivus_objects[id].setFrameProgress(0);
        $digit.css('opacity', 1);
    }

    function get_time_remaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        t = (t < 0) ? 0 : t;
        var seconds = Math.floor((t / 1000) % 60);
        seconds = (seconds < 0) ? 0 : seconds;
        var minutes = Math.floor((t / 1000 / 60) % 60);
        minutes = (minutes < 0) ? 0 : minutes;
        var hours = Math.floor((t / 1000 / 60 / 60) % 24);
        hours = (hours < 0) ? 0 : hours;
        // var days = Math.floor(t / 1000 / 60 / 60 / 24);
        // days = (days < 0) ? 0 : days;
        return {
            'total': t,
            // 'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function timer_init(endtime) {
        var time_interval = setInterval(
            function() {
                var remaining_int = get_time_remaining(endtime);
                timer_update(remaining_int);

                if (remaining_int.total <= 0) {
                    clearInterval(time_interval);
                    timer_finished();
                }

            }, timer_downtime
        );
    }

    function timer_update(remaining_int) {
        var string_time_left = "";

        for(var type in remaining_int) {
            new_timer_parsed[type] = convert_to_string(remaining_int[type]);
        }

        if (last_timer_parsed == null) {
            last_timer_parsed = $.extend({}, new_timer_parsed);
            for (var type in last_timer_parsed) {
                if (type == 'total')
                    continue;
                for (var position in last_timer_parsed[type]) {
                    vivus_number_show(get_vivus_id(type, position, last_timer_parsed[type][position]));
                }
            }
            return;
        }

        for (var type in new_timer_parsed) {
            if (type == "total") {
                continue;
            }

            for (var i = 0; i < last_timer_parsed[type].length; i++) {
                if (last_timer_parsed[type][i] != new_timer_parsed[type][i]) {
                    var old_id = get_vivus_id(type, i, last_timer_parsed[type][i]);
                    var new_id = get_vivus_id(type, i, new_timer_parsed[type][i]);
                    vivus_number_hide(old_id);
                    digit_tokens[old_id] = new_id;
                    vivus_number_show(new_id);
                }
            }
            continue;
        }
        string_time_left = /*new_timer_parsed["days"] + ":" + */new_timer_parsed["hours"] + ":" + new_timer_parsed["minutes"] + ":" + new_timer_parsed["seconds"];

        $('title').html(string_time_left);

        last_timer_parsed = $.extend({}, new_timer_parsed);

        return;
    }

    function timer_finished() {
        $("body").addClass("zero");
        // var time_interval = setInterval(digit_glitch, timer_finished_glitch_roll_delta);
    }

    function digit_glitch() {
        $(".digit").each(function() {
            var id = $(this).find(".digit-0").attr("id");
            var $svg = $("#" + id);
            if (roll_the_dice(1, 10)) {
                if($svg.attr("class").indexOf("back") != -1) {
                    vivus_number_show(id, true);
                    $svg.attr("class", $svg.attr("class").replace(" back", ""));
                    return;
                }
                vivus_number_hide(id, function() {
                    setTimeout(function() {
                        vivus_number_show(id, true);
                    }, Math.floor(Math.random() * 500));
                });
                $svg.attr("class", $svg.attr("class") + " back");
            }
        });
    }

    function vivus_number_hide(id, callback) {
        var vivus_obj = vivus_objects[id];
        var $digit = $("#" + id);
        vivus_obj.play(-1, function() {
            if (callback != null)
                callback();
            $digit.attr("class", $digit.attr("class").replace(" visible", ""));
        });
        $digit.attr("class", $digit.attr("class").replace(" active_number", ""));
    }

    function vivus_number_show(id, skip_jump) {
        var vivus_obj = vivus_objects[id];
        var $digit = $('#' + id);
        vivus_obj.setFrameProgress(0);
        vivus_obj.play(1);
        if (skip_jump)
            return;
        $digit.attr("class", $digit.attr("class") + " active_number visible");
        setTimeout(function() {
            $digit.attr("class", $digit.attr("class").replace(" active_number", ""));
        }, 100);
    }

    function convert_to_string(number) {
        result = number + "";
        if (number <= 9)
            result = "0" + result;
        return result;
    }

    function roll_the_dice(number, out_of) {
        return Math.random() < (number + 0.0) / out_of;
    }
});

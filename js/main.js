$('document').ready(function () {

    //    Resizes and crops image
    var resizableImage = function (image_target_init) {
        var $container,
            $orig_src = new Image(),
            image_target = $(image_target_init).get(0),
            $event_state = {},
            $constrain = true,
            $min_width = 350,
            $min_height = 350,
            $max_width = 1200,
            $max_height = 1200,
            $intial_width = 450,
            $intial_height = 450,
            $resize_canvas = document.createElement('canvas');


        //        Wraps the image into container and adds Handles and intial calls for action
        init = function () {

            $orig_src.src = image_target.src;
            initialResize();

            $container = $(image_target).parent('.resize-container');
            if (!$container.hasClass("resizing-the-image")) {
                $container.addClass("resizing-the-image");
                $container.on('mousedown touchstart', '.resize-handle', startResize);
                $container.on('mousedown touchstart', 'img', startMoving);
                $('.js-crop').on('click', crop);
            }
        };
        //        Resizing Before Loading
        initialResize = function () {
            var height, width;
            if (image_target.height > $intial_height && image_target.width > $intial_width) {
                height = $intial_height;
                width = height * (image_target.width / image_target.height);
                if (width < $min_width) {
                    width = $intial_width;
                    height = width * (image_target.height / image_target.width);
                }
                resizeImage(width, height);
            } else if (image_target.height > $intial_height) {
                height = $intial_height;
                width = height * (image_target.width / image_target.height);
                if (width < $min_width) {
                    width = $intial_width;
                    height = width * (image_target.height / image_target.width);
                }
                resizeImage(width, height);
            } else if (image_target.width > $intial_width) {
                width = $intial_width;
                height = width * (image_target.height / image_target.width);
                if (height < $min_height) {
                    height = $intial_height;
                    width = height * (image_target.width / image_target.height);
                }
                resizeImage(width, height);
            }
        };

        //        Starts the Resizing Process
        startResize = function (e) {
            console.log("start resize");
            e.preventDefault();
            e.stopPropagation();
            saveEventState(e);
            $(document).on('mousemove touchmove', resizing);
            $(document).on('mouseup touchend', endResize);
        };

        //        Stops The Resizing Process
        endResize = function (e) {
            console.log("end Resize");
            e.preventDefault();
            $(document).off('mouseup touchend', endResize);
            $(document).off('mousemove touchmove', resizing);
        };

        //        saving current Event State
        saveEventState = function (e) {
            $event_state.container_width = $container.width();
            $event_state.container_height = $container.height();
            $event_state.container_left = $container.offset().left;
            $event_state.container_top = $container.offset().top;
            $event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
            $event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
            $event_state.evnt = e;

        };

        //        Actual resizing
        resizing = function (e) {
            var mouse = {},
                width,
                height, left, top,
                offset = $container.offset();
            mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
            mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

            if ($($event_state.evnt.target).hasClass('resize-handle-se')) {
                width = mouse.x - $event_state.container_left;
                height = mouse.y - $event_state.container_top;
                left = $event_state.container_left;
                top = $event_state.container_top;
                console.log("se");
            } else if ($($event_state.evnt.target).hasClass('resize-handle-sw')) {
                width = $event_state.container_width - (mouse.x - $event_state.container_left);
                height = mouse.y - $event_state.container_top;
                left = mouse.x;
                top = $event_state.container_top;
                console.log("sw");

            } else if ($($event_state.evnt.target).hasClass('resize-handle-nw')) {
                width = $event_state.container_width - (mouse.x - $event_state.container_left);
                height = $event_state.container_height - (mouse.y - $event_state.container_top);
                left = mouse.x;
                top = mouse.y;
                if ($constrain || e.shiftKey) {
                    top = mouse.y - ((width / $orig_src.width * $orig_src.height) - height);
                }
                console.log("nw");

            } else if ($($event_state.evnt.target).hasClass('resize-handle-ne')) {
                width = mouse.x - $event_state.container_left;
                height = $event_state.container_height - (mouse.y - $event_state.container_top);
                left = $event_state.container_left;
                top = mouse.y;
                if ($constrain || e.shiftKey) {
                    top = mouse.y - ((width / $orig_src.width * $orig_src.height) - height);
                }
                console.log("ne");

            }

            if ($constrain || e.shiftKey) {
                height = width / $orig_src.width * $orig_src.height;
            }

            //            console.log(width+','+height);


            if (width > $min_width && height > $min_height && width < $max_width && height < $max_height) {
                resizeImage(width, height);
                console.log(height, width);
                $container.offset({
                    'left': left,
                    'top': top
                });
            }
        };

        //        Saving The Image after resizing
        resizeImage = function (width, height) {
            $resize_canvas.width = width;
            $resize_canvas.height = height;
            $resize_canvas.getContext('2d').drawImage($orig_src, 0, 0, width, height);
            $(image_target).attr('src', $resize_canvas.toDataURL("image/png"));
        };

        //        starts moving the image
        startMoving = function (e) {
            e.preventDefault();
            e.stopPropagation();
            saveEventState(e);
            $(document).on('mousemove touchmove', moving);
            $(document).on('mouseup touchend', endMoving);
            console.log("Move");
        };

        //        Stops moving the image
        endMoving = function (e) {
                e.preventDefault();
                $(document).off('mouseup touchend', endMoving);
                $(document).off('mousemove touchmove', moving);
            };
            //        Actual Moving
        moving = function (e) {
            var mouse = {};
            e.preventDefault();
            e.stopPropagation();
            mouse.x = (e.clientX || e.pageX) + $(window).scrollLeft();
            mouse.y = (e.clientY || e.pageY) + $(window).scrollTop();
            $container.offset({
                'left': mouse.x - ($event_state.mouse_x - $event_state.container_left),
                'top': mouse.y - ($event_state.mouse_y - $event_state.container_top)
            });
        };

        //        Croping image and saving it
        crop = function (e) {
            e.preventDefault();
            var crop_canvas,
                left = $('.overlay').offset().left - $container.offset().left,
                top = $('.overlay').offset().top - $container.offset().top,
                width = $('.overlay').width(),
                height = $('.overlay').height();
            crop_canvas = document.createElement('canvas');
            crop_canvas.width = width;
            crop_canvas.height = height;
            crop_canvas.getContext('2d').drawImage(image_target, left, top, width, height, 0, 0, width, height);
            $('.editor-modal').removeClass('editing-Image');
            window.open(crop_canvas.toDataURL("image/png"));
            // postImage();
        };

        //    optional:posts the cropped image to server
       /* function postImage() {
            var $img = $('.pic img').attr('src');
            console.log("Before:" + $img.length);
            $.post('API/upload_pic.php', {
                'img': $img
            }, function (data) {
                console.log("After:" + data);
                $('.overlay-preview').fadeOut(50);
            })
        }*/

        //        Initial call
        init();
    };


    //    Loading Uploaded Image
    function loaduploadedImage($image) {

        if ($image.files && $image.files[0]) {
            $imageFile = new Image();

            $imageFile.onload = function () {
                var $this = this;
                var height, width;

                //                To check for Image of low resolution
                if ($this.height < 350 || $this.width < 350) {
                    alert("Image should be greater than 350px*350px");
                    return;
                }
                $('.editor-modal').addClass('editing-Image');
                $('.resize-image').attr('src', $this.src);
                resizableImage($('.resize-image'));

            };
            var reader = new FileReader();
            $imageFile.src = window.URL.createObjectURL($image.files[0]);
        }
    }

    //    Validation For Image

    function isImage(file) {
        var name, extension, $file = $(file);
        if (file.files) {
            name = $file.val().toLowerCase();
            extension = name.substring(name.lastIndexOf('.'));

            if (['.png', '.jpeg', '.gif', '.jpg', '.bmp'].indexOf(extension) >= 0) {
                console.log("Valid image file");
                return 1;
            }
            alert("Not a Valid Image file");
            return 0;
        }
    }

    //  Preview the Edited Image;
    $('.preview-crop').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $this = $(this);

            if (!$this.hasClass('preview')) {
                $this.addClass('preview');
                $this.text("Cancel Preview");
                $('.overlay-preview').fadeIn(100);
            } else {
                $this.removeClass('preview');
                $this.text("Preview");
                $('.overlay-preview').fadeOut(50);

            }
        });
        //    Event Triggers on file upload
    $('body').on('change', '#uploaded-img', function () {
        var $this = this;
        if (isImage($this)) {
            loaduploadedImage($this);
        }
    });

});
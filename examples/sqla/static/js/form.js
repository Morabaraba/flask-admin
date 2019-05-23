(function(root) {
    var backup = {
        applyStyle: root.faForm.applyStyle,
    }

    function emApplyStyle($el, name) {
         switch (name) {
            case 'json-editor': 
                createJsonEditor($el, name);
                return true;
            default: // other wise use our backup fa style.
                return backup.applyStyle.call(this, arguments);
         }
    }
    root.faForm.applyStyle = emApplyStyle;

    var createJsonEditor = function($el, name) {
        var $parent = $el.parent().parent();

        var $editor = $('<div class="js-json-editor container-fluid" style="display: none">').insertAfter($parent);

        var options = {
            theme: 'bootstrap3',
            disable_properties: true,
            disable_edit_json: true,
            disable_collapse: true
        };
        $.extend(JSONEditor.defaults.options, options)

        var schema = {
                  type: "object",
                  properties: {
                      "Dummy Prop": { "type": "string" },
                  }
              };

        var dataSchema = $el.attr('data-schema');

        function createJsonEditorWithSchema($editor, schema) {
            // Initialize the editor
            var editor = new JSONEditor($editor[0],
                {
                  schema: schema
                }
            );
            editor.on('ready',function() {
              // Now the api methods will be available
              //editor.validate();
              $editor.find('h3').hide();
              $editor.find('.well').removeClass('well').removeClass('well-sm')
              $editor.find('.form-group').css('margin-left', '12px').css('margin-bottom', '16px')
              $editor.find('.control-label').css('margin-right', '4px')

              var v = $el.val()
              if (v) {
                v= JSON.parse(v)
                $.each(Object.keys(editor.schema.properties), function(key) { // make sure we do not drop keys that was attached to our new schema
                    if (!v[key]) {
                        v[key] = ''
                    }
                });
                editor.setValue(
                    v
                )
              }
              
              $editor.show();
            });

            editor.on('change',function() {
              var v = editor.getValue();
              v = JSON.stringify(v)
              $el.val(v)
            });
        };

        if (dataSchema) {
            $.get(dataSchema, function(data) {
                createJsonEditorWithSchema($editor, data)
            })
        } else {
            createJsonEditorWithSchema($editor, schema)
        }
    }
})(window);
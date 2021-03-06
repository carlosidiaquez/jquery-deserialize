var $elements, $form, $wrapper, originalData;

module( "Core", {
    setup: function() {
        $form = $( "#form" );
        $wrapper = $( "#qunit-fixture" );
        $elements = [ $form, $wrapper.find( ":input" ) ];
        originalData = $form.serializeArray();
    },
    teardown: function() {
        $form.deserialize( originalData );
    }
});

test( "Basic Requirements", function() {
    expect( 2 );

    ok( jQuery, "jQuery" );
    equals( jQuery, $, "$ = jQuery" );
});

$.each( [ "serialize", "serializeArray", "serializeObject" ], function( i, serializeMethod ) {
    test( "jQuery.deserialize (" + serializeMethod + ")", function() {
        var changeCount = originalData.length;

        expect( 2 * $elements.length );
        
        $.each( $elements, function( elementIndex, $element ) { 
            var changeCalledCount = 0,
                data = $form[ serializeMethod ]();

            // Completely clear the form of any values to ensure deserialize
            // repopulates the form (this differs from a form.reset(), since
            // reset only resets back to the default state from initial page
            // load).
            $form.not(':button, :submit, :reset, :hidden, :checkbox, :radio, select, option').val('');
            $(':checkbox, :radio').removeAttr('checked');
            $('select').attr('selectedIndex', -1);
            $('option:selected').removeAttr('selected');

            $form.deserialize( data, {
                change: function() {
                    changeCalledCount++;
                },
                complete: function() {
                    deepEqual( $form[ serializeMethod ](), data, "Serialized data matches deserialized data (element #" + elementIndex + ")" );
                    equal( changeCalledCount, changeCount, "Change called for each changed input (element #" + elementIndex + ")" );
                }
            });
        });
    });
});

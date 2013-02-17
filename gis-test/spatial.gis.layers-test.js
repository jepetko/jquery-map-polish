describe('spatial.gis.layers', function() {

    var id = "layers";
    var idSel = '#' + id;
    var $container;

    var data = [
        {
            id: '0',
            desc: 'Item0-X',
            children: [
                {
                    id: '01',
                    desc: 'Item01-X'
                },
                {
                    id: '02',
                    desc: 'Item02-X'
                },
                {
                    id: '03',
                    desc: 'Item03-X',
                    children: [
                        {
                            id: '030',
                            desc: 'Item030-X'
                        },
                        {
                            id: '031',
                            desc: 'Item031-X'
                        }
                    ]
                }
            ]
        },
        {
            id: '1',
            desc: 'Item1-X',
            children: [
                {
                    id: '11',
                    desc: 'Item11-X',
                    children: [
                        {
                            id: '110',
                            desc: 'Item110-X'
                        },
                        {
                            id: '111',
                            desc: 'Item111-X'
                        }
                    ]
                },
                {
                    id: '12',
                    desc: 'Item12-X'
                },
                {
                    id: '13',
                    desc: 'Item03-X'
                }
            ]
        }
    ];

    var domStr = '<li>Item0'
        + '            <ul>'
        + '                <li data-map-actions="0,1">Item01</li>'
        + '                <li data-map-actions="0,2">Item02</li>'
        + '                <li data-map-actions="0">Item03'
        + '                    <ul>'
        + '                        <li>Item030</li>'
        + '                    </ul>'
        + '                </li>'
        + '            </ul>'
        + '        </li>'
        + '        <li>Item1'
        + '            <ul>'
        + '                <li>Item10</li>'
        + '                <li data-map-layer="false">Item11</li>'
        + '                <li>Item12'
        + '                    <ul>'
        + '                        <li>Item120</li>'
        + '                        <li>Item121</li>'
        + '                    </ul>'
        + '                </li>'
        + '            </ul>'
        + '        </li>';

    beforeEach( function() {
        $('body').append('<ul id="' + id + '"></ul>');
        $container = $(idSel);
    });

    afterEach( function() {
        $(idSel).remove();
    });

    it('should fulfill general prerequisites', function() {
        expect($container).toBeDefined();
        expect($container.length).toBe(1);
        expect($container.layers).toEqual( jasmine.any(Function) );
    });

    describe('generating it from the data option { data : ...}', function() {

        it('should contain the right number of nodes at each level', function() {
            $container.layers( { data : data } );
            expect( $container.find('li').length ).toBe(12); //total count of li's
            //more detailed test

            //first branch
            expect( $container.children('li').length).toBe(2); //3 children at the second level
            expect( $container.children('li:first-child').children('ul').length).toBe(1);
            expect( $container.children('li:first-child').children('ul').children('li').length).toBe(3);

            //more complex test for the second branch
            expect( $container.children('li:nth-child(2)').children('ul').length).toBe(1);
            expect( $container.children('li:nth-child(2)').children('ul').children('li').length).toBe(3);

            var branches = $container.children('li:nth-child(2)').children('ul').children('li');
            var toBeValues = [2,0,0];
            for( var i=0; i<toBeValues.length; i++ ) {
                expect( $(branches[i]).children('ul').children('li').length).toBe( toBeValues[i] );
            }
        });

    });

    beforeEach( function() {
        //append the structure as DOM
        $(idSel).append( domStr );
    });

    describe('should be able to generate it from the DOM', function() {

        it('should contain the right number of nodes at each level', function() {
            $container.layers();
            expect( $container.find('li').length ).toBe(11); //total count of li's

            //1. branch
            expect( $container.children('li:first-child').children('ul').children('li').length).toBe(3);
            expect( $container.children('li:first-child').children('ul').children('li:first-child').children('ul').length).toBe(0);
            expect( $container.children('li:first-child').children('ul').children('li:nth-child(2)').children('ul').length).toBe(0);
            expect( $container.children('li:first-child').children('ul').children('li:nth-child(3)').children('ul').length).toBe(1);
            expect( $container.children('li:first-child').children('ul').children('li:nth-child(3)').children('ul').children('li').length).toBe(1);

        });

    });

});
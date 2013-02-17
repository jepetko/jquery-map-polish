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
        }
    ];;

    beforeEach( function() {
        $('body').remove(idSel);
        $('body').append('<ul id="' + id + '"></ul>');
        $container = $(idSel);
    });

    it('prerequisites should be fulfilled', function() {
        expect($container).toBeDefined();
        expect($container.length).toBe(1);
    });

    it('should have the method layers', function() {
        expect($container.layers).toEqual( jasmine.any(Function) );
    });

    it('should be able to process data options', function() {
        $container.layers( { data : data } );
        expect( $container.find('li').length ).toBe(6); //6 li nodes should have been created
    });

});
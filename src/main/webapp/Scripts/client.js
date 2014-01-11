$(document).ready(function() {
    var container = $('#svg');

    var controller = {
        'serverUrl': 'Server',
        'getTile': function(data) {
            var tile = (data.content % 2)
                    ? new Sprite(data.width, data.height, 'Images/grass.png')
                    : new Tile(data.width, data.height, 'Tile');

            tile.onclick = this.onClick;

            return tile;
        },
        'onClick': function(e) {
            var tile = e.originalTarget;

            var flag = new Polygon([new Point(0, 0), new Point(0, 20), new Point(10, 15), new Point(0, 10)], 'Flag');

            // Draw the flag
            var center = tile.center || tile.wrapper.center;
            console.log('Placing a flag to ' + center + '.');
            flag.onclick = function(e) {
                $(e.originalTarget).remove();
            };
            flag.place(center);

            container.append(flag.svg);

            // TODO: actually on mouse down place there some temporary item, on mouse up make it permanent and meanwhile ask server whether it can be there and if so, notify it,
        }
    };

    var engine = new Engine(container, controller, 'Server');
    engine.run();
});
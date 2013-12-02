var Buffer = require('buffer').Buffer;
var binlog = require('../lib');

/*
 * @param data an array of binary data to be parsed into binlog event
 */
function createEvent(data) {
  var buf = new Buffer(data);
  return binlog.create(buf);
}

exports.rotateEvent = function(test) {
  var data = [ 0x00,
    0x00, 0x00, 0x00, 0x00, 0x04, 0x01, 0x00, 0x00, 0x00, 0x2b, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0x00,
    0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x6d, 0x79, 0x73, 0x71, 0x6c, 0x2d, 0x62, 0x69, 0x6e, 0x2e, 0x30, 0x30, 0x30, 0x30, 0x30, 0x31 ];

  var anEvent = createEvent(data);

  test.ok(anEvent instanceof binlog.Rotate);
  test.equal(anEvent.getTypeCode(), 0x04);
  test.equal(anEvent.getEventName(), 'rotate');
  test.equal(anEvent.getTypeName(), 'Rotate');
  test.equal(anEvent.size, 0x2b - 19);
  test.equal(anEvent.position, 4);
  test.equal(anEvent.binlogName, 'mysql-bin.000001');
  test.done();
};

exports.XidEvent = function(test) {
  var data = [ 0x00,
    0xa9, 0xf2, 0x91, 0x52, 0x10, 0x01, 0x00, 0x00, 0x00, 0x1b, 0x00, 0x00, 0x00, 0x13, 0x02, 0x00, 0x00, 0x00, 0x00,
    0x44, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ];

  var anEvent = createEvent(data);

  test.ok(anEvent instanceof binlog.Xid);
  test.equal(anEvent.getEventName(), 'xid');
  test.equal(anEvent.getTypeName(), 'Xid');
  test.equal(anEvent.xid, 0x44);
  test.done();
};

exports.formatEventHeader = function(test) {
  var data = [ 0x00,
    0xec, 0x14, 0x8e, 0x52, 0x0f, 0x01, 0x00, 0x00, 0x00, 0x74, 0x00, 0x00, 0x00, 0x78, 0x00, 0x00, 0x00, 0x00, 0x00
  ];

  var buf = new Buffer(data);
  var params = binlog.parseHeader(buf);

  test.equal(params[1], 0x0f);
  test.equal(params[2], 1385043180000);

  test.done();
};
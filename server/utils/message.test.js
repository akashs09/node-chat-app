let expect = require('expect');

let {generateMessage, generateLocationMessage} = require('./message');



describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Jen';
    var text =  'Some message';
    var message = generateMessage(from, text);

    // expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from,text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'Deb';
    const latitude = 15;
    const longitude = 19;
    const url = 'http://www.google.com/maps?q=15, 19';
    const message = generateLocationMessage(from, latitude, longitude);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from, url});
  });
});

describe('The application actuators', function () {
  it('Should have a healthcheck endpoint that returns a valid status', function () {
    return request(server())
      .get('/health')
      .then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.be.json;
        expect(response).to.have.own.property('body');
        expect(response.body).to.have.own.property('status');
        expect(response.body.status).to.equal('UP');
      });
  });
});

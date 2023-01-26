const request = require("supertest");
const server = require("../index");
const jwt = require("jwt-simple");

describe("Operaciones CRUD de cafes", () => {
  it("Obteniendo todos los cafés", async () => {
    const response = await request(server).get("/cafes").send();
    const status = response.statusCode;
    expect(status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
  it("Eliminando un café inexistente", async () => {
    const token = jwt.encode({ user_id: 1 }, "secret");
    const response = await request(server)
      .delete("/cafes/9999")
      .set("Authorization", token)
      .send();
    const status = response.statusCode;
    expect(status).toBe(404);
    expect(response.body).toEqual({
      message: "No se encontró ningún cafe con ese id",
    });
  });
  it("Enviando un nuevo café", async () => {
    const id = Math.floor(Math.random() * 999);
    const cafe = { id, nombre: "Nuevo café" };
    const { body: cafes } = await request(server).post("/cafes").send(cafe);
    expect(cafes).toContainEqual(cafe);
  });
  it("Actualizando un café con IDs distintos en parámetros y payload", async () => {
    const id = 1;
    const cafe = { id, nombre: "Cortadísimo" };
    const response = await request(server).put(`/cafes/3`).send(cafe);
    const status = response.statusCode;
    expect(status).toBe(400);
    expect(response.body).toEqual({
      message: "El id del parámetro no coincide con el id del café recibido",
    });
  });
});

import Character from "../models/character.model.js";

//funcion para ver si s un valor es un entero
function isInteger(value) {
  return Number.isInteger(value);
}

// obtener todos los personajes
export const getAllCharacters = async (req, res) => {
  const characters = await Character.findAll();
  res.json(characters);
};

// obtener un personaje por id
export const getCharacterById = async (req, res) => {
  const character = await Character.findByPk(req.params.id);
  if (!character) {
    //si no se encuentra el personaje, devolver un error
    return res.status(404).json({ error: "Personaje no encontrado" });
  }
  res.json(character);
};

// crear un nuevo personaje
export const createCharacter = async (req, res) => {
  const { name, ki, race, gender, description } = req.body;

  //validar que los campos obligatorios esten presentes
  if (!name || !race || !gender || ki === undefined) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  //validar que el ki sea un numero entero
  if (!isInteger(ki)) {
    return res.status(400).json({ error: "El ki debe ser un número entero" });
  }
  //validar el género
  if (!["Male", "Female"].includes(gender)) {
    return res
      .status(400)
      .json({ error: 'El género debe ser "Male" o "Female"' });
  }
  //validar que la descripción sea una cadena
  if (description && typeof description !== "string") {
    return res
      .status(400)
      .json({ error: "La descripción debe ser una cadena" });
  }

  //verificar si ya existe un personaje con el mismo nombre
  const exists = await Character.findOne({ where: { name } });
  if (exists) {
    //si ya existe un personaje con el mismo nombre, devolver un error
    return res
      .status(400)
      .json({ error: "Ya existe un personaje con ese nombre" });
  }
    //crear el personaje
  const character = await Character.create({
    name,
    ki,
    race,
    gender,
    description,
  });
  res.status(201).json(character);
};

// actualizar un personaje
export const updateCharacter = async (req, res) => {
  const { id } = req.params;
  const { name, ki, race, gender, description } = req.body;

  //buscar personaje por id
  const character = await Character.findByPk(id);
  if (!character) {
    return res.status(404).json({ error: "Personaje no encontrado" });
  }

  //validar que los campos obligatorios esten presentes y q esten bien
  if (!name || !race || !gender || ki === undefined) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  if (!isInteger(ki)) {
    return res.status(400).json({ error: "El ki debe ser un número entero" });
  }
  if (!["Male", "Female"].includes(gender)) {
    return res
      .status(400)
      .json({ error: 'El género debe ser "Male" o "Female"' });
  }
  if (description && typeof description !== "string") {
    return res
      .status(400)
      .json({ error: "La descripción debe ser una cadena" });
  }

  //verificar si ya existe un personaje con el mismo nombre, pero no el mismo id
  const exists = await Character.findOne({ where: { name } });
  if (exists && exists.id !== character.id) {
    return res
      .status(400)
      .json({ error: "Ya existe un personaje con ese nombre" });
  }
  //actualizar el personaje
  character.name = name;
  character.ki = ki;
  character.race = race;
  character.gender = gender;
  character.description = description;
  await character.save();
  res.json(character);
};

// eliminar un personaje
export const deleteCharacter = async (req, res) => {
  const { id } = req.params;
  const character = await Character.findByPk(id);

  if (!character) {
    return res.status(404).json({ error: "Personaje no encontrado" });
  }
  await character.destroy();
  res.json({ message: "Personaje eliminado" });
};

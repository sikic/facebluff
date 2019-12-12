-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-12-2019 a las 04:50:34
-- Versión del servidor: 10.4.8-MariaDB
-- Versión de PHP: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `facebluff`
--

-- --------------------------------------------------------
CREATE DATABASE facebluff;
--
-- Estructura de tabla para la tabla `amigos`
--

CREATE TABLE `amigos` (
  `usuario1` int(11) DEFAULT NULL,
  `usuario2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `amigos`
--

INSERT INTO `amigos` (`usuario1`, `usuario2`) VALUES
(56, 52),
(52, 56),
(56, 53),
(53, 56),
(52, 53),
(53, 52),
(56, 54),
(54, 56),
(53, 54),
(54, 53),
(56, 55),
(55, 56),
(53, 55),
(55, 53),
(52, 55),
(55, 52);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuaternaria`
--

CREATE TABLE `cuaternaria` (
  `idUsuario1` int(11) DEFAULT NULL,
  `idUsuario2` int(11) DEFAULT NULL,
  `idPregunta` int(11) DEFAULT NULL,
  `idRespuesta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `cuaternaria`
--

INSERT INTO `cuaternaria` (`idUsuario1`, `idUsuario2`, `idPregunta`, `idRespuesta`) VALUES
(53, 52, 33, 69),
(53, 52, 32, 68),
(53, 52, 32, 68),
(53, 52, 27, 59),
(53, 52, 27, 59),
(53, 52, 28, 60),
(54, 53, 29, 61),
(54, 53, 31, 66),
(54, 53, 27, 58),
(54, 53, 28, 57),
(56, 52, 27, 58),
(56, 53, 27, 58),
(56, 52, 32, 67),
(56, 53, 32, 67),
(56, 54, 32, 67),
(56, 53, 30, 63),
(56, 53, 29, 62),
(56, 54, 29, 61),
(56, 53, 28, 60),
(55, 56, 29, 62),
(55, 53, 33, 70);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fotos_subidas`
--

CREATE TABLE `fotos_subidas` (
  `idUsuario` int(11) NOT NULL,
  `foto` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `fotos_subidas`
--

INSERT INTO `fotos_subidas` (`idUsuario`, `foto`) VALUES
(52, 'c5ce66ac5a7a0ecdc3f2a07e22b716b1'),
(52, '5a8ac63ddbee8b4d9820d219d49dfe2e'),
(53, '793fa8fcc9553d6c84ea710886470073'),
(53, '4736a17cc6cf5e0e2b9d472b657b214a'),
(54, '346548879bf3b6ad800ed8b7684aa22f'),
(56, 'c751a2b27932118c5eae3bfc22a5a8df'),
(56, '282c8e456dbd5ae36e16ee4f1bb60052'),
(55, '857ca71890e8b3220c0039df190faa6d'),
(55, '3a4eba1f7724ad5330a3cf1eb313b619');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`id`, `descripcion`) VALUES
(27, '¿Quien es el mejor Hokage?'),
(28, '¿ Quien forma el Equipo 7?'),
(29, '¿ Cuantos hijos tiene Naruto?'),
(30, '¿Como se llama el kyubi?'),
(31, '¿Quien es la mejor amiga de Sakura?'),
(32, '¿Quien abandona la villa de la hoja?'),
(33, '¿Quien es Tobi?'),
(34, '¿Quien es el padre de Naruto?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuesta`
--

CREATE TABLE `respuesta` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(30) DEFAULT NULL,
  `idPregunta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `respuesta`
--

INSERT INTO `respuesta` (`id`, `descripcion`, `idPregunta`) VALUES
(57, 'Naruto,Sasuke y Sakura', 28),
(58, 'Minato', 27),
(59, 'Hasirama', 27),
(60, 'Naruto,Ino,Sikamaru', 28),
(61, '2', 29),
(62, 'Ninguno', 29),
(63, 'Kurama', 30),
(64, 'Kisame', 30),
(65, 'Ino', 31),
(66, 'Hinata', 31),
(67, 'Sasuke', 32),
(68, 'Naruto', 32),
(69, 'Obito', 33),
(70, 'Madara', 33),
(71, 'Minato', 34),
(72, 'Jiraya', 34);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('AUDRtb3cBCV455VlRCMdItTTgm-FqYBS', 1576208954, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"foto\":\"ca854381b85a46a7f77a80d4065a4149\",\"currentUser\":55,\"puntos\":100,\"fotoPerfil\":\"821967f96845f5b075cf858b8b4e27f4\"}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `idUsuario1` int(11) DEFAULT NULL,
  `idUsuario2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `contraseña` varchar(22) NOT NULL,
  `fechaNacimiento` datetime DEFAULT NULL,
  `sexo` varchar(12) DEFAULT NULL,
  `fotoPerfil` varchar(100) DEFAULT NULL,
  `puntos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `contraseña`, `fechaNacimiento`, `sexo`, `fotoPerfil`, `puntos`) VALUES
(52, 'Naruto Uzumaki', 'naruto@ucm', '12345', '1996-03-06 00:00:00', 'Masculino', '1ddc466c4ec762a76627176051fbeb28', 0),
(53, 'Sasuke Uchiha', 'sasuke@ucm', '12345', '1996-03-30 00:00:00', 'Masculino', '708ecc323471d23ce58ceb5a7f64ee28', 50),
(54, 'Sakura Haruno', 'sakura@ucm', '12345', '1996-05-29 00:00:00', 'Femenino', '51575439b1db7842818ea2c5b30250d7', 150),
(55, 'Madara Uchiha', 'madara@ucm', '12345', '1957-03-14 00:00:00', 'Masculino', '821967f96845f5b075cf858b8b4e27f4', 100),
(56, 'Itachi Uchiha', 'itachi@ucm', '12345', '1987-03-05 00:00:00', 'Masculino', 'ca854381b85a46a7f77a80d4065a4149', 300);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_pregunta_respuesta`
--

CREATE TABLE `usuario_pregunta_respuesta` (
  `idUsuario` int(11) DEFAULT NULL,
  `idPregunta` int(11) DEFAULT NULL,
  `idRespuesta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario_pregunta_respuesta`
--

INSERT INTO `usuario_pregunta_respuesta` (`idUsuario`, `idPregunta`, `idRespuesta`) VALUES
(52, 31, 65),
(52, 32, 67),
(52, 27, 58),
(52, 33, 69),
(52, 34, 71),
(52, 28, 57),
(53, 27, 58),
(53, 33, 70),
(53, 29, 61),
(53, 31, 66),
(53, 32, 68),
(53, 28, 60),
(53, 30, 63),
(54, 28, 57),
(54, 33, 70),
(54, 34, 71),
(54, 29, 62),
(54, 31, 65),
(54, 32, 67),
(56, 27, 59),
(56, 32, 68),
(56, 34, 72),
(56, 30, 64),
(56, 28, 60),
(56, 29, 62),
(55, 29, 62),
(55, 33, 70);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD KEY `fk_usuario3` (`usuario1`),
  ADD KEY `fk_usuario4` (`usuario2`);

--
-- Indices de la tabla `cuaternaria`
--
ALTER TABLE `cuaternaria`
  ADD KEY `fk_usuario6` (`idUsuario1`),
  ADD KEY `fk_usuario7` (`idUsuario2`),
  ADD KEY `fk_pregunta2` (`idPregunta`),
  ADD KEY `fk_resp2` (`idRespuesta`);

--
-- Indices de la tabla `fotos_subidas`
--
ALTER TABLE `fotos_subidas`
  ADD KEY `fk_usuario55` (`idUsuario`);

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_idPregunta` (`idPregunta`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD KEY `fk_usuario1` (`idUsuario1`),
  ADD KEY `fk_usuario2` (`idUsuario2`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `usuario_pregunta_respuesta`
--
ALTER TABLE `usuario_pregunta_respuesta`
  ADD KEY `fk_usuario5` (`idUsuario`),
  ADD KEY `fk_pregunta1` (`idPregunta`),
  ADD KEY `fk_resp` (`idRespuesta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD CONSTRAINT `fk_usuario3` FOREIGN KEY (`usuario1`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_usuario4` FOREIGN KEY (`usuario2`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `cuaternaria`
--
ALTER TABLE `cuaternaria`
  ADD CONSTRAINT `fk_pregunta2` FOREIGN KEY (`idPregunta`) REFERENCES `pregunta` (`id`),
  ADD CONSTRAINT `fk_resp2` FOREIGN KEY (`idRespuesta`) REFERENCES `respuesta` (`id`),
  ADD CONSTRAINT `fk_usuario6` FOREIGN KEY (`idUsuario1`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_usuario7` FOREIGN KEY (`idUsuario2`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `fotos_subidas`
--
ALTER TABLE `fotos_subidas`
  ADD CONSTRAINT `fk_usuario55` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD CONSTRAINT `fk_idPregunta` FOREIGN KEY (`idPregunta`) REFERENCES `pregunta` (`id`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `fk_usuario1` FOREIGN KEY (`idUsuario1`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_usuario2` FOREIGN KEY (`idUsuario2`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `usuario_pregunta_respuesta`
--
ALTER TABLE `usuario_pregunta_respuesta`
  ADD CONSTRAINT `fk_pregunta1` FOREIGN KEY (`idPregunta`) REFERENCES `pregunta` (`id`),
  ADD CONSTRAINT `fk_resp` FOREIGN KEY (`idRespuesta`) REFERENCES `respuesta` (`id`),
  ADD CONSTRAINT `fk_usuario5` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

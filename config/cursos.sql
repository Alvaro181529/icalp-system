-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 08-09-2025 a las 02:58:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ph16596582676_icalp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id` bigint(20) NOT NULL,
  `imagen` text DEFAULT NULL,
  `titulo` text DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `descuento` int(11) DEFAULT NULL,
  `fechaInicio` date DEFAULT NULL,
  `fechaFin` date DEFAULT NULL,
  `numeroComunicarse` varchar(11) DEFAULT NULL,
  `usuario` text DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `FechaModificacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `FechaRegistro` datetime DEFAULT current_timestamp(),
  `tipoCurso` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `imagen`, `titulo`, `descripcion`, `descuento`, `fechaInicio`, `fechaFin`, `numeroComunicarse`, `usuario`, `estado`, `FechaModificacion`, `FechaRegistro`, `tipoCurso`) VALUES
(19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-06 21:35:45', '2025-09-06 21:25:54', NULL),
(20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-06 21:34:02', '2025-09-06 21:26:01', NULL),
(21, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-06 21:38:26', '2025-09-06 21:35:35', NULL),
(24, 'Curso-Ciencias Forenses y Criminología.jpg', 'Ciencias Forenses y Criminología', 'Aborda el estudio del delito, el criminal y la víctima desde una perspectiva científica y jurídica. ', 30, '2025-09-02', '2025-09-16', '', 'Administrador@gmail.com', 1, '2025-09-06 22:35:10', '2025-09-06 22:35:10', 'diplomados'),
(27, 'Curso-Derecho Laboral y Seguridad Social.jpg', 'Derecho Laboral y Seguridad Social', 'Estudia la normativa laboral y de seguridad social, enfocándose en la protección de los trabajadores y la resolución de conflictos laborales. ', 0, '2025-09-02', '2025-09-16', '', 'Administrador@gmail.com', 1, '2025-09-06 22:35:53', '2025-09-06 22:35:53', 'diplomados'),
(31, 'Curso-Derecho Civil y Procesal Civil.jpg', 'Derecho Civil y Procesal Civil', 'Analiza las normas que regulan las relaciones civiles y los procedimientos judiciales para su aplicación. ', 0, '2025-09-02', '2025-09-16', '', 'Administrador@gmail.com', 1, '2025-09-06 22:47:50', '2025-09-06 22:36:47', 'diplomados'),
(32, 'Curso-Derecho de Familia Niño, Niña y Adolecente.jpg', 'Derecho de Familia Niño, Niña y Adolecente', 'Examina las leyes y procesos relacionados con el matrimonio, filiación, patria potestad y tutela. ', 0, '2025-09-02', '2025-09-16', '76771530', 'Administrador@gmail.com', 1, '2025-09-06 22:37:30', '2025-09-06 22:37:30', 'diplomados'),
(34, 'Curso-Derecho Notarial y Registral.jpg', 'Derecho Notarial y Registral', 'Aborda la función notarial y los sistemas registrales que garantizan la seguridad jurídica en actos y contratos', 0, '2025-09-02', '2025-09-16', '76771530', 'Administrador@gmail.com', 1, '2025-09-06 22:45:01', '2025-09-06 22:45:01', 'diplomados'),
(35, 'Curso-Educación Superior Competencias Digitales e Inteligencia Artificial.jpg', 'Educación Superior Competencias Digitales e Inteligencia Artificial', 'Integra herramientas digitales y aplicaciones de IA en la docencia universitaria para fortalecer la innovación educativa. ', 0, '2025-09-02', '2025-09-16', '76771530', 'Administrador@gmail.com', 1, '2025-09-06 22:45:22', '2025-09-06 22:45:22', 'diplomados');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

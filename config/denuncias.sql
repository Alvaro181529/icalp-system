-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 11-02-2025 a las 03:08:52
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
-- Estructura de tabla para la tabla `denuncias`
--

CREATE TABLE `denuncias` (
  `id` int(11) NOT NULL,
  `nombres` varchar(250) DEFAULT NULL,
  `apellidos` varchar(250) DEFAULT NULL,
  `correo` varchar(250) DEFAULT NULL,
  `celular` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `documento` varchar(250) DEFAULT NULL,
  `Fecha` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `denuncias`
--

INSERT INTO `denuncias` (`id`, `nombres`, `apellidos`, `correo`, `celular`, `descripcion`, `documento`, `Fecha`) VALUES
(1, 'sndkjsadnsd', 'nsadjkdasd', 'dmfkjasnfksdjad', 324234324, NULL, 'sjamdkjasdnkas', '2025-02-10'),
(2, NULL, 'jhdsadbas', NULL, 328632726, 'dsajdhasvbdjhvasjd', NULL, '2025-02-10'),
(3, 'ashdbasb', 'jhdsadbas', 'ashdbj@gmail.com', 328632726, 'dsajdhasvbdjhvasjd', NULL, '2025-02-10'),
(4, 'ashdbasb', 'jhdsadbas', 'ashdbj@gmail.com', 328632726, 'dsajdhasvbdjhvasjd', NULL, '2025-02-10'),
(5, 'ashdbasb', 'jhdsadbas', 'ashdbj@gmail.com', 328632726, 'dsajdhasvbdjhvasjd', NULL, '2025-02-10'),
(6, 'ashdbasb', 'jhdsadbas', 'ashdbj@gmail.com', 328632726, 'dsajdhasvbdjhvasjd', NULL, '2025-02-10');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `denuncias`
--
ALTER TABLE `denuncias`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `denuncias`
--
ALTER TABLE `denuncias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

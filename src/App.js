import React, { useState,useEffect , Fragment } from 'react';

function Cita ({cita, index, eliminarCita}) {
	return(
		<div className="cita">
			<p>Mascota: <span>{cita.mascota}</span></p>
			<p>Propietario: <span>{cita.propietario}</span></p>
			<p>Fecha: <span>{cita.fecha}</span></p>
			<p>Hora: <span>{cita.hora}</span></p>
			<p>Sintomas: <span>{cita.sintomas}</span></p>
			<button 
				onClick={() => eliminarCita(index)}
			className="button eliminar u-full-width">
				Eliminar
			</button>
		</div>
	)
}


function Formulario({crearCita}){

	function fechaActual(){
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		today = yyyy + '-' + mm + '-' + dd;
		return today;
	}

	function horaActual(){
		var today = new Date();
		var now = today.getHours() + ":" + (today.getMinutes()<10?'0':'') + today.getMinutes();
		return now
	}

	const stateInicial = {
		mascota: '',
		propietario: '',
		fecha: fechaActual(),
		hora: horaActual(),
		sintomas: '',

	}

	// cita = state actual
	// acualizarCita = fn para cambiar el state
	const [cita, actualizarCita ] = useState(stateInicial);

	// actualiza el state
	const actualizarState = (e) => {
		actualizarCita({
			...cita,
			[e.target.name]: e.target.value
		})
	}

	// envia el state
	const enviarCita = e => {
		e.preventDefault();
		
		console.log(cita);
		// Pasar la cita hacia el componente principal
		crearCita(cita);

		// Reiniciar el state (reiniciar el Form)
		actualizarCita(stateInicial);
	}

	return (
		<Fragment>
			<h2>Crear Cita</h2>

			<form onSubmit={enviarCita}>
				<label>Nombre Mascota</label>
				<input 
					type="text" 
					name="mascota"
					value={cita.mascota}
					className="u-full-width" 
					placeholder="Nombre Mascota" 
					onChange={actualizarState}
				/>

				<label>Nombre Dueño</label>
				<input 
					type="text" 
					name="propietario"
					value={cita.propietario}
					className="u-full-width"  
					placeholder="Nombre Dueño de la Mascota" 
					onChange={actualizarState}
				/>

				<label>Fecha</label>
				<input 
					type="date" 
					className="u-full-width"
					name="fecha"
					value={cita.fecha}
					onChange={actualizarState}
				/>               

				<label>Hora</label>
				<input 
					type="time" 
					className="u-full-width"
					name="hora" 
					value={cita.hora}
					onChange={actualizarState}
				/>

				<label>Sintomas</label>
				<textarea 
					className="u-full-width"
					name="sintomas"
					value={cita.sintomas}
					onChange={actualizarState}
				></textarea>

				<button type="submit" className="button-primary u-full-width">Agregar</button>
			</form>
		</Fragment>
	)
}


function App() {

	//Cargar las citas de localstorage como state incial
	let citasIniciales = JSON.parse(localStorage.getItem('citas'));

	if(!citasIniciales){
		citasIniciales = [];
	}
	// useState retorna 2 funciones
	// El state actual = this.state;
	// Funcion que actualiza el state this.setState();
	const [citas, guardarCita ] = useState(citasIniciales);

	// Agregar las nuevas citas al state
	const crearCita = (cita) => {
		// Hacer una copia del state y agregar el nueco cita
		const nuevasCitas = [...citas, cita];

		// almacenamos en el state
		guardarCita(nuevasCitas);
	}

	// Elimina las Citas del State
	const eliminarCita = (index) =>{
		const nuevasCitas = [...citas];
		nuevasCitas.splice(index, 1);
		guardarCita(nuevasCitas);
	}

	useEffect(
		() => {
			let citasIniciales = JSON.parse(localStorage.getItem('citas'));

			if(citasIniciales){
				localStorage.setItem('citas', JSON.stringify(citas))
			}else{
				localStorage.setItem('citas', JSON.stringify([]))
			}
		}, [citas] )

	// Cargar condicionalmente un titulo
	const titulo = Object.keys(citas).length === 0 ? 'No hay citas' : 'Administrar las citas';
	return (
		<Fragment>
			<h1>Administador de Pacientes</h1>
			<div className="container">
				<div className="row">
					<div className="one-half column">
						<Formulario 
							crearCita = {crearCita}
						/>
					</div>
					<div className="one-half column">
						<h2>{titulo}</h2>
						{citas.map((cita, index) =>(
							<Cita
								key={index}
								index={index}
								cita={cita}
								eliminarCita={eliminarCita}
							/>
						))}
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default App;

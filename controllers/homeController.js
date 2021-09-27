exports.mostrarTrabajos = (req, res) => {
    res.render('home', {
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y publica trabajos para Desarrolladores Web',
        barra: true,
        boton: true
    })
}
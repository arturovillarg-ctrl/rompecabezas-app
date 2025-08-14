import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const PuzzleList = () => {
  const [puzzles, setPuzzles] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPuzzles = async () => {
      console.log('Iniciando fetchPuzzles...')
      try {
        if (!supabase) {
          throw new Error('Cliente Supabase no inicializado');
        }

        console.log('Realizando consulta a rompecabezas...');
        
        // Verificar la sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Estado de autenticación:', {
          tieneSession: !!session,
          usuario: session?.user?.email,
          error: sessionError
        });
        
        // Consulta con nombres de columnas correctos
        const { data, error } = await supabase
          .from('rompecabezas')
          .select('IdRompecabezas, created_at, Propietario, PrestadoA, Nombre, Marca, Tema, CantidadPiezas, DimensionVertical, DimensionHorizontal, PiezasFaltantes, Origen, Observaciones, FechaCreado, FotoCaja, FotoArmado')
          .order('IdRompecabezas', { ascending: true });
        
        if (error) {
          console.error('Error detallado:', {
            mensaje: error.message,
            codigo: error.code,
            detalles: error.details,
            hint: error.hint
          });
        }

        console.log('Respuesta de Supabase:', { 
          data, 
          error, 
          tipoData: typeof data,
          longitudData: data ? data.length : 0,
          primeraFila: data && data.length > 0 ? data[0] : null
        })

        if (error) {
          console.error('Error al cargar rompecabezas:', error)
          setError(error.message)
        } else {
          console.log('Datos recibidos:', {
            cantidad: data ? data.length : 0,
            datos: data,
            hayDatos: Array.isArray(data) && data.length > 0
          });
          setPuzzles(data || [])
        }
      } catch (e) {
        console.error('Error inesperado:', e)
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPuzzles()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Mi colección de rompecabezas 🧩</h2>
        <p>Cargando rompecabezas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Mi colección de rompecabezas 🧩</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Mi colección de rompecabezas 🧩</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {puzzles.length === 0 ? (
          <li>No hay rompecabezas para mostrar.</li>
        ) : (
          puzzles.map(puzzle => (
            <li key={puzzle.IdRompecabezas} style={{ marginBottom: '2rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
              <h3 style={{ marginTop: 0 }}>{puzzle.Nombre}</h3>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flexBasis: '200px' }}>
                  {puzzle.FotoCaja && (
                    <img 
                      src={puzzle.FotoCaja} 
                      alt={puzzle.Nombre} 
                      style={{ 
                        width: '200px', 
                        height: '200px', 
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                      onError={(e) => {
                        console.error('Error cargando imagen:', puzzle.FotoCaja);
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div>
                  <p><strong>Marca:</strong> {puzzle.Marca}</p>
                  <p><strong>Tema:</strong> {puzzle.Tema}</p>
                  <p><strong>Piezas:</strong> {puzzle.CantidadPiezas}</p>
                  <p><strong>Dimensiones:</strong> {puzzle.DimensionVertical} x {puzzle.DimensionHorizontal} cm</p>
                  <p><strong>Propietario:</strong> {puzzle.Propietario}</p>
                  {puzzle.PrestadoA && <p><strong>Prestado a:</strong> {puzzle.PrestadoA}</p>}
                  {puzzle.PiezasFaltantes > 0 && <p><strong>Piezas faltantes:</strong> {puzzle.PiezasFaltantes}</p>}
                  {puzzle.Observaciones && <p><strong>Observaciones:</strong> {puzzle.Observaciones}</p>}
                  {puzzle.FechaCreado && <p><strong>Fecha:</strong> {new Date(puzzle.FechaCreado).toLocaleDateString()}</p>}
                  {puzzle.Origen && <p><strong>Origen:</strong> {puzzle.Origen}</p>}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default PuzzleList
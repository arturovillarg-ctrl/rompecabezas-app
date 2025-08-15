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
    <div style={{ 
      padding: '1rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      width: '100%'
    }}>
      <h2 style={{ 
        textAlign: 'center',
        color: '#333',
        marginBottom: '2rem',
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'
      }}>
        Mi colección de rompecabezas 🧩
      </h2>
      <div style={{ 
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        {puzzles.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            gridColumn: '1 / -1'
          }}>
            No hay rompecabezas para mostrar.
          </div>
        ) : (
          puzzles.map(puzzle => (
            <div key={puzzle.IdRompecabezas} style={{ 
              border: '1px solid #ddd', 
              padding: '1rem', 
              borderRadius: '12px',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <h3 style={{ 
                marginTop: 0, 
                marginBottom: '1rem',
                fontSize: '1.2rem',
                color: '#333'
              }}>
                {puzzle.Nombre}
              </h3>
              
              {puzzle.FotoCaja && (
                <div style={{ 
                  width: '100%',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <img 
                    src={puzzle.FotoCaja} 
                    alt={puzzle.Nombre} 
                    style={{ 
                      width: '100%',
                      maxWidth: '250px',
                      height: '200px', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      console.error('Error cargando imagen:', puzzle.FotoCaja);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div style={{ 
                display: 'grid',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}>
                {puzzle.Marca && <p style={{ margin: 0 }}><strong>Marca:</strong> {puzzle.Marca}</p>}
                {puzzle.Tema && <p style={{ margin: 0 }}><strong>Tema:</strong> {puzzle.Tema}</p>}
                {puzzle.CantidadPiezas && <p style={{ margin: 0 }}><strong>Piezas:</strong> {puzzle.CantidadPiezas}</p>}
                {(puzzle.DimensionVertical && puzzle.DimensionHorizontal) && (
                  <p style={{ margin: 0 }}>
                    <strong>Dimensiones:</strong> {puzzle.DimensionVertical} x {puzzle.DimensionHorizontal} cm
                  </p>
                )}
                {puzzle.Propietario && <p style={{ margin: 0 }}><strong>Propietario:</strong> {puzzle.Propietario}</p>}
                {puzzle.PrestadoA && <p style={{ margin: 0, color: '#e67e22' }}><strong>Prestado a:</strong> {puzzle.PrestadoA}</p>}
                {puzzle.PiezasFaltantes > 0 && (
                  <p style={{ margin: 0, color: '#e74c3c' }}>
                    <strong>Piezas faltantes:</strong> {puzzle.PiezasFaltantes}
                  </p>
                )}
                {puzzle.Observaciones && <p style={{ margin: 0 }}><strong>Observaciones:</strong> {puzzle.Observaciones}</p>}
                {puzzle.FechaCreado && (
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                    <strong>Fecha:</strong> {new Date(puzzle.FechaCreado).toLocaleDateString()}
                  </p>
                )}
                {puzzle.Origen && <p style={{ margin: 0 }}><strong>Origen:</strong> {puzzle.Origen}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PuzzleList
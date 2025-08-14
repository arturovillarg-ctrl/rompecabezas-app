import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configura tu URL y clave de Supabase
import React, { useEffect, useState } from 'react'
const supabaseUrl = 'https://Rompecabezas.supabase.co';
const supabaseKey = 'Pr1vado2!';
const supabase = createClient(supabaseUrl, supabaseKey);

function RompecabezasLista() {
    const [rompecabezas, setRompecabezas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRompecabezas() {
            const { data, error } = await supabase
                .from('Rompecabezas')
                .select('IdRompecabezas, Nombre, FotoCaja');
            if (error) {
                console.error(error);
            } else {
                setRompecabezas(data);
            }
            setLoading(false);
        }
        fetchRompecabezas();
    }, []);

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            <h2>Lista de Rompecabezas</h2>
            <ul>
                {rompecabezas.map((item) => (
                    <li key={item.IdRompecabezas}>
                        <h3>{item.Nombre}</h3>
                        {item.FotoCaja && (
                            <img src={item.FotoCaja} alt={item.Nombre} width={200} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RompecabezasLista;


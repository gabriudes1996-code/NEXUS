
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fqqrivibwodbwbdqnflz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxcXJpdmlid29kYndiZHFuZmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjcxMDUsImV4cCI6MjA4NjcwMzEwNX0.fJzRHa2Wd3qu2_eeqCKbWOiwFzQgRoCYICm-d4qe8gM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const mockDocs = [
    { nome: 'Edital de Abertura', tipo: 'Edital', url: '#' },
    { nome: 'Proposta Comercial', tipo: 'Proposta', url: '#' },
    { nome: 'Folder Técnico', tipo: 'Folder', url: '#' },
];

async function seedDocs() {
    console.log('Seeding documents...');

    // Get all licitacoes
    const { data: lics, error } = await supabase.from('licitacoes').select('id, empresa');

    if (error) {
        console.error('Error fetching licitacoes', error);
        return;
    }

    for (const lic of lics) {
        // Insert 3 mock docs for each licitacao
        const docsToInsert = mockDocs.map(d => ({
            licitacao_id: lic.id,
            nome: d.nome,
            tipo: d.tipo,
            url: d.url
        }));

        const { error: insError } = await supabase.from('documentos').insert(docsToInsert);
        if (insError) console.error(`Failed to insert docs for ${lic.id}:`, insError);
        else console.log(`Inserted docs for ${lic.empresa} - ${lic.id}`);
    }
}

seedDocs();

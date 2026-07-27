// Uso: node scripts/hash-password.js "tu-contraseña"
// Genera un hash bcrypt para insertar manualmente en la tabla admin_users
// de Supabase (columna password_hash). Nunca guardar la contraseña en texto plano.
const bcrypt = require("bcryptjs");

const plain = process.argv[2];
if (!plain) {
  console.error('Uso: node scripts/hash-password.js "tu-contraseña"');
  process.exit(1);
}

bcrypt.hash(plain, 12).then((hash) => {
  console.log("\nHash generado (columna password_hash):\n");
  console.log(hash);
  console.log(
    "\nInsertalo en Supabase con:\n" +
      `insert into admin_users (username, password_hash) values ('tu-usuario', '${hash}');\n`
  );
});

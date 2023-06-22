<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <form @submit.prevent="login">
            <div class="text-center mb-4">
                <div class="logo-container">
                    <img src="../../assets/logo_telas.jpg" alt="Logo" class="logo">
                    <h2 class="h2">Iniciar sesión</h2>
                </div>
            </div>

            <!-- Email input -->
            <div class="form-outline mb-4">
                <input type="email" id="form2Example1" class="form-control" required />
                <label class="form-label" for="form2Example1">Correo electrónico</label>
            </div>

            <!-- Password input -->
            <div class="form-outline mb-4">
                <input type="password" id="form2Example2" class="form-control" required />
                <label class="form-label" for="form2Example2">Contraseña</label>
            </div>

            <!-- 2 column grid layout for inline styling -->
            <div class="row mb-4">
                <div class="col d-flex justify-content-center">
                    <!-- Checkbox -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="form2Example31" checked />
                        <label class="form-check-label" for="form2Example31">Recordarme</label>
                    </div>
                </div>

                <div class="col">
                    <!-- Simple link -->
                    <a href="" @click="forgotPass">¿Olvidaste tu contraseña?</a>
                </div>
            </div>

            <!-- Submit button -->
            <button type="submit" class="btn btn-primary full-width d-block" @click="log">Iniciar sesión</button>

            <!-- Register buttons -->
            <div class="text-center">
                <p>¿No tienes una cuenta? <a href="#!">Registrarse</a></p>
                <p>O inicia sesión con:</p>
                <button type="button" class="btn btn-link btn-floating mx-1">
                    <i class="bi bi-facebook"></i>
                </button>

                <button type="button" class="btn btn-link btn-floating mx-1">
                    <i class="bi bi-google"></i>
                </button>

                <button type="button" class="btn btn-link btn-floating mx-1">
                    <i class="bi bi-twitter"></i>
                </button>

                <button type="button" class="btn btn-link btn-floating mx-1">
                    <i class="bi bi-github"></i>
                </button>
            </div>
        </form>
    </div>
</template>
  
<script>
import Swal from 'sweetalert2';

export default {
    methods: {
        forgotPass() {
            this.$router.push('/sendEmail');
        },
        login() {
            // Obtener los valores de correo electrónico y contraseña
            const email = document.getElementById('form2Example1').value;
            const password = document.getElementById('form2Example2').value;

            // Aquí puedes realizar la verificación de las credenciales
            if (email === 'admin@gmail.com' && password === 'admin') {
                // Las credenciales son válidas
                Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: 'Bienvenido',
                    showConfirmButton: false,
                    timer: 1500
                });

                this.$store.commit('setLoggedIn', true);
                this.$router.push('/home');
            } else {
                // Las credenciales son inválidas, muestra un mensaje de error o realiza alguna acción apropiada
                console.log('Credenciales inválidas');
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inicio de sesión',
                    text: 'Credenciales inválidas',
                });
            }
          //this.$store.commit('setLoggedIn', true);
        }
    },
    mounted() {
        console.log('logged false');
        this.$store.commit('setCheck', false);
        this.$store.commit('setLoggedIn', false);
    },
};
</script>

  
<style scoped>
.d-flex {
    display: flex;
}

.justify-content-center {
    justify-content: center;
}


.align-items-center {
    align-items: center;
}

.full-width {
    width: 100%;
}


.vh-100 {
    min-height: 100vh;
}

.logo-container {
    margin-right: 20px;

    #logotelas {
        width: 130px;
        height: 80px;
    }

    #logotelas:hover {
        cursor: pointer;
    }
}

.logo {
    width: 300px;
    height: 250px;
    margin-bottom: 60px;
    border-radius: 20%;
}
</style>
  
<template>
  <v-row justify="center">
    <v-col cols="12" md="4" class="mt-11">
      <v-card
        elevation="24"
        class="py-4 px-4"
        :loading="isLoading"
        :disabled="isLoading"
      >
        <v-card-text class="text-center">
          <v-row dense>
            <v-col cols="12" class="text-left" style="height: 40px" />

            <v-col cols="12" class="pb-6">
              <Logo width="60%" />
            </v-col>

            <v-col v-if="!item" cols="12">
              <p v-if="isLoading" class="py-2">Validando información</p>
              <div v-else>
                <v-icon size="48" color="warning">mdi-alert-circle</v-icon>
                <p class="py-2">
                  La cuenta ya está confirmada y/o la acción no es procesable
                </p>
              </div>
            </v-col>

            <v-col v-else cols="12">
              <v-form
                v-if="!success"
                ref="formRef"
                @submit.prevent="handleAction"
              >
                <v-row dense>
                  <v-col cols="12">
                    <VisVal label="E-mail" :value="item.email" />
                  </v-col>

                  <v-col cols="12" class="text-left">
                    <InpPassword
                      label="Contraseña"
                      v-model="item.password"
                      counter
                      :rules="rules.passwordRequired"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-btn
                      block
                      color="success"
                      type="submit"
                      :loading="isLoading"
                    >
                      Confirmar cuenta
                      <v-icon end>mdi-account-check</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <v-row v-else>
                <v-col cols="12">
                  <v-icon size="48" color="success">mdi-check-circle</v-icon>
                  <p class="py-2">Serás redireccionado a tu cuenta en breve</p>
                  <v-progress-circular size="16" indeterminate />
                </v-col>
              </v-row>
            </v-col>

            <v-col v-if="!isLoading && !success" cols="12" class="pt-8">
              <BtnTheme />
            </v-col>

            <v-col cols="12" class="pt-2">
              <Version />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
// Librerías externas
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// Estado global y utilidades
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

// Componentes
import Logo from "@/components/Logo.vue";
import VisVal from "@/components/VisVal.vue";
import InpPassword from "@/components/InpPassword.vue";
import BtnTheme from "@/components/BtnTheme.vue";
import Version from "@/components/Version.vue";

// Estado
const store = useStore();
const alert = inject("alert");
const router = useRouter();
const route = useRoute();

const itemId = route.params.id;
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const success = ref(false);
const rules = getRules();

// Obtener el usuario
const getItem = async () => {
  try {
    const url = `${URL_API}/public/user/account_confirm/${itemId}`;
    const response = await axios.get(url, getHdrs());
    item.value = { ...getRsp(response).data.item, password: null };
  } catch (err) {
    getErr(err);
  } finally {
    isLoading.value = false;
  }
};

// Confirmar cuenta y login automático
const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isLoading.value = true;
  const payload = getObj(item.value, true);

  try {
    // Confirmación
    let endpoint = `${URL_API}/public/user/account_confirm/${itemId}`;
    await axios.post(endpoint, payload, getHdrs());
    success.value = true;

    setTimeout(async () => {
      try {
        // Login automático
        endpoint = `${URL_API}/auth/login`;
        const response = await axios.post(endpoint, payload, getHdrs());
        await store.loginAction(getRsp(response).data.auth);
        await router.push({ name: "home" });
      } catch (err) {
        alert?.show("red-darken-1", getErr(err));
      }
    }, 5000);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Inicialización
onMounted(() => {
  setTimeout(() => getItem(), 2500);
});
</script>

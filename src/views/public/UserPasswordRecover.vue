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
            <v-col cols="12" class="text-left" style="height: 40px">
              <BtnBack :route="{ name: 'login' }" />
            </v-col>

            <v-col cols="12" class="pb-6">
              <Logo width="60%" />
            </v-col>

            <v-col cols="12">
              <v-form
                v-if="!success"
                ref="formRef"
                @submit.prevent="handleAction"
              >
                <v-row dense>
                  <v-col cols="12" class="text-left">
                    <v-text-field
                      v-model="item.email"
                      label="E-mail"
                      type="email"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-email-outline"
                      maxlength="65"
                      counter
                      :rules="rules.emailRequired"
                      hide-details="auto"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-btn
                      block
                      color="info"
                      type="submit"
                      :loading="isLoading"
                    >
                      Recuperar
                      <v-icon end>mdi-email-fast</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <v-row v-else>
                <v-col cols="12">
                  <v-icon size="48" color="info">mdi-information</v-icon>
                  <p class="py-2">
                    Hemos enviado un correo a
                    <br />
                    <b>{{ item.email }}</b>
                    <br />
                    con instrucciones para restablecer tu contraseña
                  </p>
                  <p class="py-2">
                    <small>Cuentas con 5 min. para realizar esta acción</small>
                  </p>
                </v-col>
              </v-row>
            </v-col>

            <v-col v-if="!isLoading" cols="12" class="pt-8">
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
import { useRoute } from "vue-router";
import axios from "axios";

// Estado global y utilidades
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import Logo from "@/components/Logo.vue";
import BtnTheme from "@/components/BtnTheme.vue";
import Version from "@/components/Version.vue";

// Estado
const store = useStore();
const alert = inject("alert");
const route = useRoute();

const isLoading = ref(false);
const formRef = ref(null);
const item = ref({ email: route.query.email || null });
const success = ref(false);
const rules = getRules();

// Enviar email de recuperación
const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isLoading.value = true;
  const payload = getObj(item.value, true);

  try {
    const endpoint = `${URL_API}/public/user/password/recover`;
    await axios.post(endpoint, payload, getHdrs());
    success.value = true;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};
</script>

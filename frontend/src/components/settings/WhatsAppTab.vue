<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  MessageSquare,
  Phone,
  Check,
  Loader2,
  Copy,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Unlink,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { api } from '@/lib/api'

interface WhatsAppStatus {
  phone: string | null
  is_verified: boolean
  code?: string
  code_expires_at?: string
}

interface CountryCode {
  code: string
  country: string
  flag: string
  phoneMask: string
  phoneLength: number
}

const countryCodes: CountryCode[] = [
  { code: '55', country: 'Brasil', flag: '🇧🇷', phoneMask: '## #####-####', phoneLength: 11 },
  { code: '1', country: 'Estados Unidos', flag: '🇺🇸', phoneMask: '### ###-####', phoneLength: 10 },
  { code: '351', country: 'Portugal', flag: '🇵🇹', phoneMask: '### ### ###', phoneLength: 9 },
  { code: '54', country: 'Argentina', flag: '🇦🇷', phoneMask: '## ####-####', phoneLength: 10 },
  { code: '56', country: 'Chile', flag: '🇨🇱', phoneMask: '# #### ####', phoneLength: 9 },
  { code: '57', country: 'Colombia', flag: '🇨🇴', phoneMask: '### ### ####', phoneLength: 10 },
  { code: '52', country: 'Mexico', flag: '🇲🇽', phoneMask: '## #### ####', phoneLength: 10 },
  { code: '598', country: 'Uruguai', flag: '🇺🇾', phoneMask: '## ### ###', phoneLength: 8 },
  { code: '595', country: 'Paraguai', flag: '🇵🇾', phoneMask: '### ### ###', phoneLength: 9 },
  { code: '34', country: 'Espanha', flag: '🇪🇸', phoneMask: '### ### ###', phoneLength: 9 },
]

const queryClient = useQueryClient()
const { user } = useAuth()
const { success, error: showError } = useToast()

// WhatsApp bot number (this should come from config/env)
const WHATSAPP_BOT_NUMBER = '5511999999999'

const selectedCountryCode = ref('55')
const phoneNumber = ref('')
const generatedCode = ref('')
const codeExpiration = ref<Date | null>(null)

const selectedCountry = computed(() =>
  countryCodes.find(c => c.code === selectedCountryCode.value) || countryCodes[0]
)

const fullPhoneNumber = computed(() =>
  selectedCountryCode.value + phoneNumber.value.replace(/\D/g, '')
)

const isPhoneValid = computed(() => {
  const digits = phoneNumber.value.replace(/\D/g, '')
  return digits.length === selectedCountry.value.phoneLength
})

// Fetch WhatsApp status
const { data: whatsappStatus, isLoading: isLoadingStatus, refetch: refetchStatus } = useQuery({
  queryKey: ['whatsapp-status'],
  queryFn: async () => {
    const response = await api.get<WhatsAppStatus>('/user/whatsapp/status')
    return response
  },
})

const isLinked = computed(() => whatsappStatus.value?.is_verified === true)
const linkedPhone = computed(() => whatsappStatus.value?.phone)

// Request verification code
const requestCodeMutation = useMutation({
  mutationFn: async (phone: string) => {
    const response = await api.post<{ code: string; expires_at: string }>('/user/whatsapp/request-code', { phone })
    return response
  },
  onSuccess: (data) => {
    generatedCode.value = data.code
    codeExpiration.value = new Date(data.expires_at)
    success('Codigo gerado', 'Digite o codigo no WhatsApp para validar')
  },
  onError: (e: any) => {
    showError('Erro', e.data?.message || 'Nao foi possivel gerar o codigo')
  },
})

// Unlink WhatsApp
const unlinkMutation = useMutation({
  mutationFn: async () => {
    await api.delete('/user/whatsapp')
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['whatsapp-status'] })
    generatedCode.value = ''
    codeExpiration.value = null
    phoneNumber.value = ''
    success('WhatsApp desvinculado', 'Voce pode vincular outro numero')
  },
  onError: (e: any) => {
    showError('Erro', e.data?.message || 'Nao foi possivel desvincular')
  },
})

function formatPhoneDisplay(phone: string): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')

  // Try to find country code
  for (const country of countryCodes) {
    if (digits.startsWith(country.code)) {
      const localNumber = digits.slice(country.code.length)
      return `+${country.code} ${applyMask(localNumber, country.phoneMask)}`
    }
  }

  // Default Brazilian format
  if (digits.length <= 2) return `+${digits}`
  if (digits.length <= 4) return `+${digits.slice(0, 2)} ${digits.slice(2)}`
  if (digits.length <= 9) return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`
  return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 9)}-${digits.slice(9, 13)}`
}

function applyMask(value: string, mask: string): string {
  const digits = value.replace(/\D/g, '')
  let result = ''
  let digitIndex = 0

  for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
    if (mask[i] === '#') {
      result += digits[digitIndex]
      digitIndex++
    } else {
      result += mask[i]
    }
  }

  return result
}

function handlePhoneInput(e: Event) {
  const target = e.target as HTMLInputElement
  const digits = target.value.replace(/\D/g, '')

  // Limit to max phone length for the country
  const maxLength = selectedCountry.value.phoneLength
  const limitedDigits = digits.slice(0, maxLength)

  // Apply mask
  phoneNumber.value = applyMask(limitedDigits, selectedCountry.value.phoneMask)
}

function handleRequestCode() {
  if (!isPhoneValid.value) {
    showError('Erro', 'Digite um numero de telefone valido')
    return
  }
  requestCodeMutation.mutate(fullPhoneNumber.value)
}

function copyCode() {
  navigator.clipboard.writeText(generatedCode.value)
  success('Copiado!', 'Codigo copiado para a area de transferencia')
}

function openWhatsApp() {
  const message = encodeURIComponent(`codigo:${generatedCode.value}`)
  window.open(`https://wa.me/${WHATSAPP_BOT_NUMBER}?text=${message}`, '_blank')
}

function handleUnlink() {
  if (confirm('Tem certeza que deseja desvincular o WhatsApp?')) {
    unlinkMutation.mutate()
  }
}

// Clear phone when country changes
watch(selectedCountryCode, () => {
  phoneNumber.value = ''
})

// Poll for verification status when code is generated
const isPolling = ref(false)
let pollInterval: ReturnType<typeof setInterval> | null = null

function startPolling() {
  if (pollInterval) return
  isPolling.value = true
  pollInterval = setInterval(async () => {
    await refetchStatus()
    if (whatsappStatus.value?.is_verified) {
      stopPolling()
      generatedCode.value = ''
      codeExpiration.value = null
      success('WhatsApp vinculado!', 'Seu numero foi verificado com sucesso')
    }
  }, 3000)
}

function stopPolling() {
  isPolling.value = false
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

onMounted(() => {
  if (user.value?.phone) {
    // Parse existing phone and set country code + number
    const phone = user.value.phone
    for (const country of countryCodes) {
      if (phone.startsWith(country.code)) {
        selectedCountryCode.value = country.code
        const localNumber = phone.slice(country.code.length)
        phoneNumber.value = applyMask(localNumber, country.phoneMask)
        break
      }
    }
  }
})

// Cleanup polling on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <div v-if="isLoadingStatus" class="bg-surface-container-lowest rounded-xl shadow-editorial p-6">
      <div class="flex items-center justify-center py-8">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>

    <!-- Linked state -->
    <div v-else-if="isLinked" class="bg-surface-container-lowest rounded-xl shadow-editorial p-6">
      <h2 class="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
        <MessageSquare class="h-5 w-5 text-green-500" />
        Integracao com WhatsApp
      </h2>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
          <div class="flex items-center gap-3">
            <Phone class="h-10 w-10 p-2 bg-green-500 text-white rounded-full" />
            <div>
              <p class="font-medium text-on-surface">WhatsApp conectado</p>
              <p class="text-sm text-on-surface-variant">{{ formatPhoneDisplay(linkedPhone || '') }}</p>
            </div>
          </div>
          <Badge variant="success">
            <Check class="h-3 w-3 mr-1" />
            Verificado
          </Badge>
        </div>

        <div class="space-y-3">
          <h3 class="font-medium text-on-surface">O que voce pode fazer:</h3>
          <ul class="space-y-2 text-on-surface-variant">
            <li class="flex items-start gap-2">
              <Check class="h-4 w-4 text-green-500 mt-0.5" />
              Registrar transacoes por mensagem de texto
            </li>
            <li class="flex items-start gap-2">
              <Check class="h-4 w-4 text-green-500 mt-0.5" />
              Receber resumos diarios e semanais
            </li>
            <li class="flex items-start gap-2">
              <Check class="h-4 w-4 text-green-500 mt-0.5" />
              Consultar saldo e extrato
            </li>
            <li class="flex items-start gap-2">
              <Check class="h-4 w-4 text-green-500 mt-0.5" />
              Alertas de vencimento de contas
            </li>
          </ul>
        </div>

        <Separator />

        <div>
          <h3 class="font-medium text-on-surface mb-2">Comandos disponiveis:</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div class="p-3 bg-surface-container rounded-lg">
              <code class="text-primary text-sm">gastei 50 com almoco</code>
              <p class="text-xs text-on-surface-variant mt-1">Registra uma despesa</p>
            </div>
            <div class="p-3 bg-surface-container rounded-lg">
              <code class="text-primary text-sm">recebi 3000 de salario</code>
              <p class="text-xs text-on-surface-variant mt-1">Registra uma receita</p>
            </div>
            <div class="p-3 bg-surface-container rounded-lg">
              <code class="text-primary text-sm">saldo</code>
              <p class="text-xs text-on-surface-variant mt-1">Consulta o saldo atual</p>
            </div>
            <div class="p-3 bg-surface-container rounded-lg">
              <code class="text-primary text-sm">extrato</code>
              <p class="text-xs text-on-surface-variant mt-1">Ultimas transacoes</p>
            </div>
          </div>
        </div>

        <Separator />

        <Button
          variant="outline"
          class="text-tertiary border-tertiary/20 hover:bg-tertiary/10"
          @click="handleUnlink"
          :disabled="unlinkMutation.isPending.value"
        >
          <Unlink v-if="!unlinkMutation.isPending.value" class="h-4 w-4 mr-2" />
          <Loader2 v-else class="h-4 w-4 animate-spin mr-2" />
          Desvincular WhatsApp
        </Button>
      </div>
    </div>

    <!-- Not linked state -->
    <template v-else>
      <!-- Instructions -->
      <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
        <h3 class="font-medium text-amber-700 mb-2 flex items-center gap-2">
          <AlertCircle class="h-5 w-5" />
          Como vincular seu WhatsApp
        </h3>
        <ol class="text-sm text-amber-700/80 space-y-1 list-decimal list-inside">
          <li>Selecione seu pais e digite o numero (ex: 98 98469-0450)</li>
          <li>Clique em "Enviar codigo"</li>
          <li>Um codigo de 6 digitos sera exibido na tela</li>
          <li>Clique em "Validar no WhatsApp"</li>
          <li>O WhatsApp abrira com uma mensagem pronta</li>
          <li>Digite o codigo de 6 digitos e envie</li>
          <li>Pronto! Seu WhatsApp estara vinculado</li>
        </ol>
      </div>

      <!-- Phone input -->
      <div class="bg-surface-container-lowest rounded-xl shadow-editorial p-6">
        <h2 class="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
          <MessageSquare class="h-5 w-5 text-green-500" />
          Vincular WhatsApp
        </h2>

        <div class="space-y-4">
          <div>
            <Label class="mb-2">Numero do WhatsApp</Label>
            <div class="flex gap-2">
              <!-- Country code select -->
              <Select v-model="selectedCountryCode" :disabled="!!generatedCode">
                <SelectTrigger class="w-[160px]">
                  <SelectValue>
                    <span class="flex items-center gap-2">
                      <span>{{ selectedCountry.flag }}</span>
                      <span>+{{ selectedCountry.code }}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="country in countryCodes"
                    :key="country.code"
                    :value="country.code"
                  >
                    <span class="flex items-center gap-2">
                      <span>{{ country.flag }}</span>
                      <span>+{{ country.code }}</span>
                      <span class="text-on-surface-variant text-sm">{{ country.country }}</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <!-- Phone number input -->
              <Input
                :model-value="phoneNumber"
                @input="handlePhoneInput"
                type="tel"
                :placeholder="selectedCountry.phoneMask.replace(/#/g, '9')"
                :disabled="!!generatedCode"
                class="flex-1"
              />
            </div>
            <p class="text-xs text-on-surface-variant mt-1">
              Digite o DDD e numero ({{ selectedCountry.phoneLength }} digitos para {{ selectedCountry.country }})
            </p>
          </div>

          <!-- Code display -->
          <div v-if="generatedCode" class="space-y-4">
            <div class="p-4 bg-primary/10 rounded-lg text-center">
              <p class="text-sm text-on-surface-variant mb-2">Seu codigo de verificacao:</p>
              <div class="flex items-center justify-center gap-2">
                <span class="text-3xl font-mono font-bold text-primary tracking-widest">
                  {{ generatedCode }}
                </span>
                <Button variant="ghost" size="sm" @click="copyCode">
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
              <p v-if="codeExpiration" class="text-xs text-on-surface-variant mt-2">
                Valido por 10 minutos
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-2">
              <Button @click="openWhatsApp" class="flex-1 bg-green-600 hover:bg-green-700">
                <ExternalLink class="h-4 w-4 mr-2" />
                Validar no WhatsApp
              </Button>
              <Button
                variant="outline"
                @click="startPolling"
                :disabled="isPolling"
              >
                <Loader2 v-if="isPolling" class="h-4 w-4 animate-spin mr-2" />
                <RefreshCw v-else class="h-4 w-4 mr-2" />
                {{ isPolling ? 'Verificando...' : 'Verificar status' }}
              </Button>
            </div>

            <p class="text-sm text-on-surface-variant text-center">
              Apos enviar o codigo no WhatsApp, clique em "Verificar status" para confirmar a vinculacao.
            </p>
          </div>

          <!-- Request code button -->
          <Button
            v-else
            @click="handleRequestCode"
            :disabled="requestCodeMutation.isPending.value || !isPhoneValid"
            class="w-full"
          >
            <Loader2 v-if="requestCodeMutation.isPending.value" class="h-4 w-4 animate-spin mr-2" />
            <Phone v-else class="h-4 w-4 mr-2" />
            {{ requestCodeMutation.isPending.value ? 'Gerando codigo...' : 'Enviar codigo' }}
          </Button>
        </div>
      </div>
    </template>
  </div>
</template>

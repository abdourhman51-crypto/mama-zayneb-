import { PIXEL_ID } from '@/lib/pixel';
import { dzPhoneToE164, hashForMeta } from './hash';

const GRAPH_VERSION = 'v21.0';

type LeadEventInput = {
  eventId: string;
  phone: string; // محلّي بصيغة 0XXXXXXXXX (من normalizeDzPhone)
  eventSourceUrl: string;
  clientIp: string | null;
  userAgent: string | null;
  fbp: string | null;
  fbc: string | null;
};

/**
 * يرسل حدث Lead إلى Meta Conversions API مباشرة من الخادم.
 *
 * يحتاج META_CAPI_ACCESS_TOKEN (Meta Events Manager → Settings →
 * Conversions API → Generate access token). بدونه تُتخطّى العملية
 * بصمت — لا يتعطّل حفظ التسجيل ولا بيكسل المتصفّح إطلاقاً.
 *
 * eventId يُطابق event_id نفسه الذي يُرسله بيكسل المتصفّح لحدث Lead،
 * حتى تُزيل ميتا التكرار بين القناتين لنفس عملية التسجيل (راجع
 * "Using the API" → event de-duplication في توثيق Conversions API).
 */
export async function sendLeadEventToMeta(input: LeadEventInput): Promise<void> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) return;

  const userData: Record<string, unknown> = {
    ph: [hashForMeta(dzPhoneToE164(input.phone))],
  };
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const event: Record<string, unknown> = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_id: input.eventId,
    event_source_url: input.eventSourceUrl,
    user_data: userData,
  };

  const payload: Record<string, unknown> = { data: [event] };

  // اختياري: كود اختبار من تبويب Test Events في Meta Events Manager،
  // للتحقّق من وصول الأحداث دون أن تُحتسَب في التقارير الحقيقية.
  const testEventCode = process.env.META_CAPI_TEST_EVENT_CODE;
  if (testEventCode) payload.test_event_code = testEventCode;

  const endpoint = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${accessToken}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('Meta CAPI rejected the event:', res.status, detail.slice(0, 500));
    }
  } catch (err) {
    console.error('Meta CAPI request failed:', err);
  }
}

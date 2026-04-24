import type { FormSettings } from '@/libs/forms/store/types';
import { Toggle, Row } from '../validation-panels/text-validation-panel';

interface SettingsPanelProps {
  settings: FormSettings;
  onChange: (patch: Partial<FormSettings>) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  return (
    <div className='space-y-5'>
      <div>
        <h3 className='mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400'>
          Responses
        </h3>
        <div className='space-y-3'>
          <Toggle
            label='Accepting responses'
            checked={settings.acceptingResponses}
            onChange={(v) => onChange({ acceptingResponses: v })}
          />
          <Toggle
            label='Allow multiple submissions'
            checked={settings.allowMultipleSubmissions ?? false}
            onChange={(v) => onChange({ allowMultipleSubmissions: v })}
          />
          <Row label='Close date'>
            <input
              type='datetime-local'
              value={settings.closeDate ?? ''}
              onChange={(e) =>
                onChange({ closeDate: e.target.value || undefined })
              }
              className='input-field mt-1'
            />
          </Row>
          <Row label='Max responses'>
            <input
              type='number'
              min={1}
              value={settings.maxResponses ?? ''}
              onChange={(e) =>
                onChange({
                  maxResponses: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              placeholder='Unlimited'
              className='input-field mt-1'
            />
          </Row>
        </div>
      </div>

      <div className='border-t border-slate-100 pt-4'>
        <h3 className='mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400'>
          Presentation
        </h3>
        <div className='space-y-3'>
          <Toggle
            label='Show progress bar'
            checked={settings.showProgressBar ?? false}
            onChange={(v) => onChange({ showProgressBar: v })}
          />
          <Toggle
            label='Shuffle questions'
            checked={settings.shuffleQuestions ?? false}
            onChange={(v) => onChange({ shuffleQuestions: v })}
          />
        </div>
      </div>

      <div className='border-t border-slate-100 pt-4'>
        <h3 className='mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400'>
          Completion
        </h3>
        <div className='space-y-3'>
          <Row label='Confirmation message'>
            <textarea
              value={settings.confirmationMessage}
              onChange={(e) =>
                onChange({ confirmationMessage: e.target.value })
              }
              rows={3}
              className='input-field mt-1 resize-none'
              placeholder='Thank you for completing this form.'
            />
          </Row>
          <Row label='Redirect URL (optional)'>
            <input
              type='url'
              value={settings.redirectUrl ?? ''}
              onChange={(e) =>
                onChange({ redirectUrl: e.target.value || undefined })
              }
              placeholder='https://example.com/thank-you'
              className='input-field mt-1'
            />
          </Row>
        </div>
      </div>
    </div>
  );
}

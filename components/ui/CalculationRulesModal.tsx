'use client';

import React from 'react';

interface CalculationRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export default function CalculationRulesModal({ isOpen, onClose, language }: CalculationRulesModalProps) {
  if (!isOpen) return null;

  const rules = [
    {
      criterion: language === 'ru' ? 'Гарантированный минимальный доход (ГМД)' : 'Гарантияланган минималдык киреше (ГМК)',
      situation: language === 'ru' ? 'ГМД ежегодно устанавливается Кабмином' : 'ГМК жыл сайын Кабмин тарабынан белгиленет',
      action: language === 'ru' ? 'Загружать ежегодно новое значение в систему (справочник)' : 'Жыл сайын системага жаңы маанини жүктөө (аныктама)',
      documents: language === 'ru' ? 'Постановление КМ КР' : 'КМ КРнын токтому',
      calculation: language === 'ru' ? 'Если среднедушевой доход ≥ ГМД → отказ' : 'Эгерде киши башына киреше ≥ ГМК → баш тартуу'
    },
    {
      criterion: language === 'ru' ? 'Среднедушевой доход' : 'Киши башына киреше',
      situation: language === 'ru' ? 'Доход семьи за 3 мес. ÷ 3 ÷ число членов семьи' : 'Үй-бүлөнүн 3 айлык кирешеси ÷ 3 ÷ мүчөлөрдүн саны',
      action: language === 'ru' ? 'Автоматический расчет' : 'Автоматтык эсептөө',
      documents: language === 'ru' ? 'Справки о доходах, данные СФ, Налоговой, Түндүк' : 'Кирешелер боюнча справкалар, СФ, Налогдук, Түндүк маалыматтары',
      calculation: language === 'ru' ? 'Если < ГМД → может назначаться' : 'Эгерде < ГМК → тагайындалышы мүмкүн'
    },
    {
      criterion: language === 'ru' ? 'Доходы по месту работы/службы/учёбы' : 'Жумуш/кызмат/окуу жайында кирешелер',
      situation: language === 'ru' ? 'Зарплата, премии, надбавки, довольствие, стипендии, матпомощь' : 'Эмгек акы, премиялар, кошумчалар, камкордук, стипендиялар, материалдык жардам',
      action: language === 'ru' ? 'Включать в доход' : 'Кирешеге кошуу',
      documents: language === 'ru' ? 'Справки с работы/учёбы' : 'Жумуш/окуу жайынан справкалар',
      calculation: language === 'ru' ? 'Учитывать полностью' : 'Толук эсептөө'
    },
    {
      criterion: language === 'ru' ? 'Сельхозживотные' : 'Айыл чарбасынын жаныбарлары',
      situation: language === 'ru' ? 'Семья имеет животных' : 'Үй-бүлөдө жаныбарлар бар',
      action: language === 'ru' ? 'Переводить в МРС: 1 корова = 6; телка = 2,5; бык = 8; лошадь = 7; овца/коза = 1' : 'МРСга которуу: 1 уй = 6; телке = 2,5; бука = 8; ат = 7; кой/эчки = 1',
      documents: language === 'ru' ? 'Данные ветслужбы / айыл окмоту' : 'Ветслужба / айыл окмоту маалыматтары',
      calculation: language === 'ru' ? 'Пособие не назначается, если > 4 МРС на 1 члена семьи' : 'Жөлөкпул тагайындалбайт, эгерде 1 мүчөгө > 4 МРС болсо'
    },
    {
      criterion: language === 'ru' ? 'Товары длительного пользования' : 'Узак мөөнөттүү товарлар',
      situation: language === 'ru' ? 'Авто <20 лет, грузовик, трактор/комбайн, микроавтобус' : 'Авто <20 жыл, жүк ташуучу, трактор/комбайн, микроавтобус',
      action: language === 'ru' ? 'Отказ в назначении' : 'Тагайындоодон баш тартуу',
      documents: language === 'ru' ? 'Справка ГРС, осмотр' : 'ГРС справкасы, текшерүү',
      calculation: language === 'ru' ? 'Если хотя бы 1 есть → отказ' : 'Эгерде эң аз 1 бар болсо → баш тартуу'
    },
    {
      criterion: language === 'ru' ? 'Доходы, не учитываемые' : 'Эсептелбеген кирешелер',
      situation: language === 'ru' ? 'Пособия, пособие на погребение, матпомощь, стипендии, командировочные, соцконтракт (3 мес.), выплаты персональному ассистенту и др.' : 'Жөлөкпулдар, көмүү жөлөкпулу, материалдык жардам, стипендиялар, командировкалык, соцконтракт (3 ай), жеке ассистентке төлөмдөр ж.б.',
      action: language === 'ru' ? 'Исключить из расчета' : 'Эсептөөдөн чыгаруу',
      documents: language === 'ru' ? 'Закон и постановление' : 'Мыйзам жана токтом',
      calculation: language === 'ru' ? 'Не учитывать' : 'Эсептөө'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'ru' ? 'Правила расчета доходов' : 'Кирешелерди эсептөө эрежелери'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    {language === 'ru' ? 'Критерий' : 'Критерий'}
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    {language === 'ru' ? 'Ситуация' : 'Жагдай'}
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    {language === 'ru' ? 'Что делать' : 'Эмне кылуу'}
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    {language === 'ru' ? 'Документы / источники' : 'Документтер / булактар'}
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                    {language === 'ru' ? 'Как считать доход / условие отказа' : 'Кирешени кантип эсептөө / баш тартуу шарты'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                      {rule.criterion}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">
                      {rule.situation}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">
                      {rule.action}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">
                      {rule.documents}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">
                      {rule.calculation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              {language === 'ru' ? 'Важные примечания:' : 'Маанилүү эскертүүлөр:'}
            </h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• {language === 'ru' ? 'ГМД устанавливается ежегодно Кабинетом Министров' : 'ГМК жыл сайын Министрлер Кабинети тарабынан белгиленет'}</li>
              <li>• {language === 'ru' ? 'Среднедушевой доход рассчитывается за 3 месяца' : 'Киши башына киреше 3 ай боюнча эсептелет'}</li>
              <li>• {language === 'ru' ? 'МРС - мелкий рогатый скот в условных единицах' : 'МРС - шарттуу бирдиктердеги кичинекей мүйүздүү мал'}</li>
              <li>• {language === 'ru' ? 'Автомобили старше 20 лет не учитываются как актив' : '20 жылдан улуу автомобилдер актив катары эсептелбейт'}</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'ru' ? 'Закрыть' : 'Жабуу'}
          </button>
        </div>
      </div>
    </div>
  );
}

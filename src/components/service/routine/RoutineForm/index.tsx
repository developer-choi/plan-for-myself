'use client';

import designSystemStyles from '@/styles/design-system.module.scss';
import Radio, {RadioGroup} from '@/components/form/Radio';
import Input from '@/components/form/Input';
import Button from '@/components/element/Button';
import {H2} from '@/components/element/typography';
import React from 'react';
import useRoutineForm, {RoutineFormParameter} from '@/utils/service/routine/useRoutineForm';

export default function RoutineForm({record, detail}: RoutineFormParameter) {
  const {form, inputProps, step} = useRoutineForm({record, detail});

  return (
    <form className={designSystemStyles.commonForm} onSubmit={form.onSubmit}>
      <RadioGroup label="date_type">
        {inputProps.dateType.map(props => (
          <Radio key={props.value as string} {...props}/>
        ))}
      </RadioGroup>
      <RadioGroup label="routine_type">
        {inputProps.routineType.map(props => (
          <Radio key={props.value as string} {...props}/>
        ))}
      </RadioGroup>
      <Input {...inputProps.title}/>
      <div>
        <Button onClick={form.append.habit}>Append Habit</Button>
        <Button onClick={form.append.link}>Append Link</Button>
        <Button onClick={form.append.studiedMinutes}>Append studied_minutes</Button>
        <Button onClick={form.append.sleepTime}>Append sleep time</Button>
      </div>
      {step.list.map((item, index) => {
        const remove = () => step.remove(index);

        switch (item.type) {
          case 'link':
            return (
              <div
                key={item.id}
                className={designSystemStyles.commonSubForm}
                onDragStart={step.dragAndDrop.onDragStartCallback(index)}
                onDrop={step.dragAndDrop.onDropCallback(index)}
                draggable={step.dragAndDrop.draggable}
                onDragOver={step.dragAndDrop.onDragOver}
              >
                <H2>{item.type}</H2>
                <Button size="small" color="delete" onClick={remove}>삭제</Button>
                <Input {...item.text}/>
                <Input {...item.url}/>
              </div>
            );

          case 'habit':
            return (
              <div key={item.id} className={designSystemStyles.commonSubForm}>
                <H2>{item.type}</H2>
                <Button size="small" color="delete" onClick={remove}>삭제</Button>
                <Input {...item.text}/>
                <Input {...item.keyword}/>
              </div>
            );

          case 'studied_minutes':
          case 'sleep_time':
            return (
              <div key={item.id} className={designSystemStyles.commonSubForm}>
                <Button size="small" color="delete" onClick={remove}>삭제</Button>
                <H2>{item.type}</H2>
                <Input {...item.input}/>
              </div>
            );
        }
      })}
      <Button type="submit" size="large">제출</Button>
    </form>
  );
}

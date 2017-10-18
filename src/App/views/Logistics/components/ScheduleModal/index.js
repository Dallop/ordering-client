import React from 'react'
// import Modal from 'App/shared/Modal'
import { Flex, Box, Title, Close, Modal, settings as s } from 'App/UI'
import { indexToWeekDay, weekModelToString } from 'App/logic'

const CloseAction = (
  { onClick, color = s.colors.textOnLight, size = '25px' }
) => (
  <Close
    {...{
      size,
      onClick,
      color,
      css: { cursor: 'pointer', transition: '.2s' },
      onHover: { transform: 'scale(1.1)' }
    }}
  />
)

const Schedule = ({ isOpen, location, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      heading={(
        <Box>
          <Title fontSize={3}>Pick Up Hours</Title>
          <Box pt={1}>{location.title}</Box>
        </Box>
        )}
    >
      {weekModelToString(location.availability.weekModel).map((weekDay, i) => {
        let value = ''
        if (!weekDay.length) {
          value = 'Unavailable'
        } else {
          value = weekDay.map((times, i) => <Box key={i}>{times}</Box>)
        }

        return (
          <Flex
            key={i}
            p={2}
            bg={i % 2 ? s.colors.lightBaseHighlight : s.colors.base}
            justify='space-between'
            textAlign='right'
            >
            <Title>{indexToWeekDay[i]}</Title>
            <Box pl={4}>{value}</Box>
          </Flex>
        )
      })}
    </Modal>
  )
}

export default Schedule

import {
  Project,
  ProjectChangeCartsConfiguration,
  ProjectChangeCountriesAction,
  ProjectChangeCountryTaxRateFallbackEnabledAction,
  ProjectChangeCurrenciesAction,
  ProjectChangeLanguagesAction,
  ProjectChangeMessagesEnabledAction,
  ProjectChangeNameAction,
  ProjectSetExternalOAuthAction,
  ProjectSetShippingRateInputTypeAction,
  ProjectUpdateAction,
} from '@commercetools/platform-sdk'
import { InvalidOperationError } from '@commercetools/platform-sdk'
import { Writable } from 'types'
import { checkConcurrentModification } from './errors'
import { CommercetoolsError } from '../exceptions'
import { AbstractRepository } from './abstract'

export class ProjectRepository extends AbstractRepository {
  get(projectKey: string): Project | null {
    const data = this._storage.getProject(projectKey)
    return this._storage.getProject(projectKey)
  }

  save(projectKey: string, resource: Project) {
    const current = this.get(projectKey)

    if (current) {
      checkConcurrentModification(current, resource.version)
    } else {
      if (resource.version !== 0) {
        throw new CommercetoolsError<InvalidOperationError>(
          {
            code: 'InvalidOperation',
            message: 'version on create must be 0',
          },
          400
        )
      }
    }

    // @ts-ignore
    resource.version += 1
    this._storage.saveProject(resource)
  }

  actions: Partial<
    Record<
      ProjectUpdateAction['action'],
      (projectKey: string, resource: Writable<Project>, action: any) => void
    >
  > = {
    changeName: (
      projectKey: string,
      resource: Writable<Project>,
      { name }: ProjectChangeNameAction
    ) => {
      resource.name = name
    },
    changeCurrencies: (
      projectKey: string,
      resource: Writable<Project>,
      { currencies }: ProjectChangeCurrenciesAction
    ) => {
      resource.currencies = currencies
    },
    changeCountries: (
      projectKey: string,
      resource: Writable<Project>,
      { countries }: ProjectChangeCountriesAction
    ) => {
      resource.countries = countries
    },
    changeLanguages: (
      projectKey: string,
      resource: Writable<Project>,
      { languages }: ProjectChangeLanguagesAction
    ) => {
      resource.languages = languages
    },
    changeMessagesEnabled: (
      projectKey: string,
      resource: Writable<Project>,
      { messagesEnabled }: ProjectChangeMessagesEnabledAction
    ) => {
      resource.messages.enabled = messagesEnabled
    },
    setShippingRateInputType: (
      projectKey: string,
      resource: Writable<Project>,
      { shippingRateInputType }: ProjectSetShippingRateInputTypeAction
    ) => {
      resource.shippingRateInputType = shippingRateInputType
    },
    setExternalOAuth: (
      projectKey: string,
      resource: Writable<Project>,
      { externalOAuth }: ProjectSetExternalOAuthAction
    ) => {
      resource.externalOAuth = externalOAuth
    },
    changeCountryTaxRateFallbackEnabled: (
      projectKey: string,
      resource: Writable<Project>,
      {
        countryTaxRateFallbackEnabled,
      }: ProjectChangeCountryTaxRateFallbackEnabledAction
    ) => {
      resource.carts.countryTaxRateFallbackEnabled = countryTaxRateFallbackEnabled
    },
    changeCartsConfiguration: (
      projectKey: string,
      resource: Writable<Project>,
      { cartsConfiguration }: ProjectChangeCartsConfiguration
    ) => {
      resource.carts = cartsConfiguration || {
        countryTaxRateFallbackEnabled: false,
        deleteDaysAfterLastModification: 90,
      }
    },
  }
}